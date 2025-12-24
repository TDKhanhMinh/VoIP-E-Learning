import { describe, it, expect, vi, beforeEach } from "vitest";
import * as userService from "../../../src/service/userService.js";
import User from "../../../src/model/user.js";
import { syncUserToAsterisk } from "../../../src/service/asteriskSyncService.js";
import bcrypt from "bcryptjs";

const mocks = vi.hoisted(() => {
  const mockSort = vi.fn();
  const mockFind = vi.fn(() => ({
    sort: mockSort,
  }));

  const mockSelect = vi.fn();
  const mockFindByIdAndUpdate = vi.fn(() => ({
    select: mockSelect,
  }));

  const mockFindOne = vi.fn();
  const mockCreate = vi.fn();

  const mockSyncAsterisk = vi.fn();

  const mockGenSalt = vi.fn();
  const mockHash = vi.fn();

  return {
    mockSort,
    mockFind,
    mockSelect,
    mockFindByIdAndUpdate,
    mockFindOne,
    mockCreate,
    mockSyncAsterisk,
    mockGenSalt,
    mockHash,
  };
});

vi.mock("../../../src/model/user.js", () => ({
  default: {
    find: mocks.mockFind,
    create: mocks.mockCreate,
    findByIdAndUpdate: mocks.mockFindByIdAndUpdate,
    findOne: mocks.mockFindOne,
  },
}));

vi.mock("../../../src/service/asteriskSyncService.js", () => ({
  syncUserToAsterisk: mocks.mockSyncAsterisk,
}));

vi.mock("bcryptjs", () => ({
  default: {
    genSalt: mocks.mockGenSalt,
    hash: mocks.mockHash,
  },
}));

describe("User Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.mockFind.mockReturnValue({ sort: mocks.mockSort });
    mocks.mockFindByIdAndUpdate.mockReturnValue({ select: mocks.mockSelect });
  });

  describe("getAllUser", () => {
    it("should return all users sorted by createdAt desc", async () => {
      const mockUsers = [{ name: "User 1" }];
      mocks.mockSort.mockResolvedValue(mockUsers);

      const result = await userService.getAllUser();

      expect(User.find).toHaveBeenCalledWith({});
      expect(mocks.mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockUsers);
    });

    it("should filter by role if provided", async () => {
      const role = "admin";
      const mockUsers = [{ name: "Admin", role: "admin" }];
      mocks.mockSort.mockResolvedValue(mockUsers);

      await userService.getAllUser(role);

      expect(User.find).toHaveBeenCalledWith({ role });
    });
  });

  describe("createUser", () => {
    const userData = { email: "test@test.com", password: "123" };

    it("should create user, sync asterisk and return user without password", async () => {
      mocks.mockFindOne.mockResolvedValue(null);

      const createdUserDoc = {
        ...userData,
        _id: "user-id",
        sipPassword: "123",
        toObject: () => ({ ...userData, _id: "user-id", sipPassword: "123" }),
      };
      mocks.mockCreate.mockResolvedValue(createdUserDoc);

      const result = await userService.createUser(userData);

      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(User.create).toHaveBeenCalledWith({
        ...userData,
        sipPassword: userData.password,
      });

      expect(syncUserToAsterisk).toHaveBeenCalledWith({
        _id: "user-id",
        email: userData.email,
        passwordPlain: "123",
      });

      expect(result).not.toHaveProperty("password");
      expect(result).toHaveProperty("email", userData.email);
    });

    it("should throw error if email already exists", async () => {
      mocks.mockFindOne.mockResolvedValue({ _id: "existing" });

      await expect(userService.createUser(userData)).rejects.toThrow(
        "Email has been used"
      );

      expect(User.create).not.toHaveBeenCalled();
    });

    it("should log error but continue if Asterisk sync fails", async () => {
      mocks.mockFindOne.mockResolvedValue(null);

      const createdUserDoc = {
        ...userData,
        _id: "user-id",
        sipPassword: "123",
        toObject: () => ({ ...userData, _id: "user-id" }),
      };
      mocks.mockCreate.mockResolvedValue(createdUserDoc);

      mocks.mockSyncAsterisk.mockRejectedValue(new Error("Asterisk fail"));
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await expect(userService.createUser(userData)).resolves.not.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Lỗi đồng bộ Asterisk:",
        "Asterisk fail"
      );
    });
  });

  describe("updateUser", () => {
    const id = "user-1";

    it("should update basic info without hashing password", async () => {
      const updateData = { full_name: "Updated Name", invalid: null };
      const mockUpdatedUser = { _id: id, full_name: "Updated Name" };

      mocks.mockSelect.mockResolvedValue(mockUpdatedUser);

      const result = await userService.updateUser(id, updateData);

      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        { $set: { full_name: "Updated Name" } },
        { new: true }
      );
      expect(result).toEqual(mockUpdatedUser);
    });

    it("should hash password if provided", async () => {
      const updateData = { password: "newpass" };

      mocks.mockGenSalt.mockResolvedValue("salt");
      mocks.mockHash.mockResolvedValue("hashed_pass");
      mocks.mockSelect.mockResolvedValue({ _id: id });

      await userService.updateUser(id, updateData);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith("newpass", "salt");

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          $set: expect.objectContaining({
            password: "hashed_pass",
            sipPassword: "newpass",
          }),
        }),
        { new: true }
      );
    });

    it("should throw 404 if user not found to update", async () => {
      mocks.mockSelect.mockResolvedValue(null);

      await expect(userService.updateUser(id, {})).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("deleteUser", () => {
    it("should soft delete user (available: false)", async () => {
      mocks.mockFindByIdAndUpdate.mockResolvedValue({
        _id: "1",
        available: false,
      });

      mocks.mockFindByIdAndUpdate.mockResolvedValueOnce({ _id: "1" });

      const result = await userService.deleteUser("1");

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith("1", {
        available: false,
      });
      expect(result).toBeDefined();
    });

    it("should throw 404 if user not found", async () => {
      mocks.mockFindByIdAndUpdate.mockResolvedValueOnce(null);

      await expect(userService.deleteUser("invalid")).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("findByEmail", () => {
    it("should return user if found", async () => {
      const mockUser = { email: "a@a.com" };
      mocks.mockFindOne.mockResolvedValue(mockUser);

      const result = await userService.findByEmail("a@a.com");
      expect(result).toEqual(mockUser);
    });

    it("should throw 404 if not found", async () => {
      mocks.mockFindOne.mockResolvedValue(null);
      await expect(userService.findByEmail("b@b.com")).rejects.toThrow(
        "User with email b@b.com not found"
      );
    });
  });

  describe("findById", () => {
    it("should return user if found", async () => {
      const mockUser = { _id: "123" };
      mocks.mockFindOne.mockResolvedValue(mockUser);

      const result = await userService.findById("123");
      expect(result).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith({ _id: "123" });
    });

    it("should throw 404 if not found", async () => {
      mocks.mockFindOne.mockResolvedValue(null);
      await expect(userService.findById("999")).rejects.toThrow(
        "User with Id 999 not found"
      );
    });
  });
});
