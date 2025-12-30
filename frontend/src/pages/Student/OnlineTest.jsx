import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import OnlineTestCard from "../../components/Tests/OnlineTestCard";
import { testService } from "../../services/testService";
import TestCardSkeleton from "./../../components/SkeletonLoading/TestCardSkeleton";

function OnlineTest() {
  const [tests, setTests] = useState([]);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.refreshAt) {
      setRefreshKey(location.state.refreshAt);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchTests = async () => {
      setIsLoading(true);
      try {
        const res = await testService.getTestByStudent();
        setTests(res);
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, [refreshKey]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 p-4 gap-4">
      {isLoading ? (
        [...Array(4)].map((_, index) => <TestCardSkeleton key={index} />)
      ) : tests.length > 0 ? (
        tests.map((test) => (
          <OnlineTestCard key={test._id} data={test} refreshKey={refreshKey} />
        ))
      ) : (
        <div className="col-span-1 lg:col-span-2 text-center py-10">
          <p className="text-gray-500 dark:text-gray-400 italic">
            Hiện tại không có bài kiểm tra nào.
          </p>
        </div>
      )}
    </div>
  );
}

export default OnlineTest;
