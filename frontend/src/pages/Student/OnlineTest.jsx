import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import OnlineTestCard from "../../components/Tests/OnlineTestCard";
import { testService } from "../../services/testService";

function OnlineTest() {
  const [tests, setTests] = useState([]);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const location = useLocation();

  useEffect(() => {
    if (location.state?.refreshAt) {
      setRefreshKey(location.state.refreshAt);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await testService.getTestByStudent();
        setTests(res);
      } catch (error) {
        console.error("rror fetching tests:", error);
      }
    };

    fetchTests();
  }, [refreshKey]);

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 p-4 gap-4`}>
      {tests.map((test) => (
        <OnlineTestCard key={test._id} data={test} refreshKey={refreshKey} />
      ))}
    </div>
  );
}

export default OnlineTest;
