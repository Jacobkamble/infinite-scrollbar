import React, { useEffect, useState, useCallback } from "react";
import { generateURL } from "../utils/constants";

const InfiniteContainer: React.FC = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (page: number) => {
    const URL = generateURL(10, 10 * (page - 1));
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(URL);
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status}`);
      }
      const json = await res.json();
      setData((prev) => [...prev, ...json.products]);
      setTotal(json.total);
      setCurrentPage(page + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const handleScroll = useCallback(() => {
    const { scrollTop, offsetHeight } = document.documentElement;
    if (
      window.innerHeight + scrollTop + 500 > offsetHeight &&
      !isLoading &&
      currentPage <= Math.ceil(total / 10)
    ) {
      fetchData(currentPage);
    }
  }, [fetchData, isLoading, currentPage, total]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      <ul>
        {data.map((prod: any) => (
          <li style={{ listStyle: "none" }} key={prod.id}>
            <div style={{ border: "2px solid red" }}>
              <img src={prod.thumbnail} alt={prod.title} />
              <h3>{prod.title}</h3>
            </div>
          </li>
        ))}
        {isLoading && <h2>Loading...</h2>}
        {error && <h2 style={{ color: "red" }}>{error}</h2>}
      </ul>
      {!isLoading && currentPage > Math.ceil(total / 10) && <h2>No more items to load</h2>}
    </>
  );
};

export default InfiniteContainer;
