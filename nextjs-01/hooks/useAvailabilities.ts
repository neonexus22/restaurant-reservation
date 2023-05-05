import axios from "axios";
import { useState } from "react";
import { Time } from "../utils/convertToDisplayTime";

type Params = {
  slug: string;
  day: string;
  time: string;
  partySize: string;
};

export default function useAvailabilities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<{ time: Time; available: boolean }[] | null>(
    null
  );

  const fetchAvailabilities = async ({
    slug,
    day,
    time,
    partySize,
  }: Params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/restaurant/${slug}/availability`,
        {
          params: {
            day,
            time,
            partySize,
          },
        }
      );
      setLoading(false);
      setData(response.data);
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.errorMessage);
      setData(null);
    }
  };

  return { loading, data, error, fetchAvailabilities };
}
