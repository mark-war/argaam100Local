import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { fetchArgaamSectors } from "../services/screenerApi";
import { setArgaamSectors } from "../redux/features/sectorSlice";

const useFetchSectors = () => {
  const dispatch = useDispatch();

  const fetchSectors = useCallback(async () => {
    try {
      const fetchedSectors = await fetchArgaamSectors();
      dispatch(setArgaamSectors(fetchedSectors));
    } catch (error) {
      console.error("Error fetching Argaam sectors:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);
};

export default useFetchSectors;
