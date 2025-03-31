import Loading from "@/components/Loading";
import { getZandi } from "@/service/my/getZandi";
import { ResponsiveTimeRange } from "@nivo/calendar";
import { useEffect, useState } from "react";

export default function Calendar({ userData }) {
  const [zandi, setZandi] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log(userData);
  useEffect(() => {
    const fetchZandiData = async () => {
      setIsLoading(true);
      if (userData) {
        try {
          const data = await getZandi(userData);
          setZandi(data);
          console.log(zandi);
        } catch (error) {
          console.error("Error fetching zandi data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchZandiData();
  }, [userData]);

  if (isLoading) {
    return <Loading />;
  }
  if (!zandi) return null;

  return (
    <div className="calendar max-w-[1440px] w-full hidden sm:h-32 sm:block md:h-48">
      <ResponsiveTimeRange
        data={zandi.items}
        from={zandi.from}
        to={zandi.to}
        emptyColor="#eeeeee"
        colors={["#D5EDFF", "#A8D1FF", "#85B5FA", "#5F8DFF"]}
        margin={{ top: 40, right: 30, bottom: 0, left: 30 }}
        dayBorderWidth={2}
        minValue={0}
        maxValue={20}
        dayRadius={10}
        dayBorderColor="#ffffff"
        legends={[]}
        tooltip={({ day, value }) => (
          <div className="bg-white px-2 py-1 border border-solid border-gray-300 rounded-sm">
            <div className="flex flex-col gap-1">
              <strong className="text-14">{day}</strong>
              <span className="text-14">학습량 : {value || 0}</span>
            </div>
          </div>
        )}
      />
    </div>
  );
}
