export const EMAIL_DELIVERY = Symbol('EMAIL_DELIVERY');

export interface EmailDeliveryPort {
  sendPasswordReset(input: {
    email: string;
    token: string;
    expiresAt: Date;
  }): Promise<void>;
  sendEmailVerification(input: {
    email: string;
    token: string;
    expiresAt: Date;
  }): Promise<void>;
}
