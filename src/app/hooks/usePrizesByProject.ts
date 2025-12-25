import { useState, useEffect } from "react";
import { OptionType } from "../components/models/CommonModels";
import { getPrizesByProject } from "../controllers/Prizes/PrizesController";

export const usePrizesByProject = (projectCode: string) => {
  const [prizesByProject, setPrizes] = useState<OptionType[]>([]);

  useEffect(() => {
    if (!projectCode) return;

    const fetchPrizes = async () => {
      try {
        const result = await getPrizesByProject(projectCode);
        if (Array.isArray(result.Data)) {
          const prizeOptions = result.Data.map((item: any) => ({
            value: item.GiftID,
            label: item.PrizeName,
            stockQuantity: item.Quantity ?? 0,   // <-- để hiển thị tồn kho
            remainingWeight: item.RemainingWeight ?? 0 // <-- để hiển thị tỷ lệ còn lại
          }));
          setPrizes(prizeOptions);
        } else {
          setPrizes([]);
        }
      } catch (error) {
        console.error("Lỗi hiển thị giải thưởng:", error);
      }
    };

    fetchPrizes();
  }, [projectCode]);

  return prizesByProject;
};
