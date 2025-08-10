import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import fonts from "../../styles/fonts";
import BackIcon from "../../assets/top/icon-top-backArrow.svg";

interface Props {
  onClose: () => void;
  onDateSelect: (date: string) => void;
  selectedDate: string;
}

function CalendarModal({ onClose, onDateSelect, selectedDate }: Props) {
  const today = new Date();
  const [selectedDateState, setSelectedDateState] = useState<Date>(
    new Date(selectedDate)
  );
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  };

  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const totalCells = 42;
  const emptyBefore = Array.from({ length: firstDay });
  const dayCells = Array.from({ length: daysInMonth });
  const emptyAfter = Array.from({
    length: totalCells - firstDay - daysInMonth,
  });

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentYear, currentMonth, day);
    setSelectedDateState(selected);
  };

  return (
    <div
    className="fixed top-1/2 left-1/2 -translate-x-1/2 bottom-[0] z-50 flex justify-center items-center bg-[#F2F2F7] rounded-[15px]"
    style={{
      width: "100%",
      maxWidth: "375px",
      height: "100%",
      fontFamily: fonts.family,
    }}
  >
      <div className="h-full w-full overflow-hidden flex flex-col">
      {/* 상단 헤더 */}
      <div className="sticky z-10 flex items-center justify-between w-full px-[14px] py-[25px] bg-[#F2F2F7] rounded-t-[15px]">
        <button onClick={onClose}>
          <img src={BackIcon} alt="닫기" width={26} height={22} />
        </button>
        <div style={{ fontSize: "20px", fontWeight: fonts.weight.bold }}>
          날짜 편집
        </div>
        <button
          onClick={() => {
            const formatted = formatDate(selectedDateState);
            onDateSelect(formatted);
            onClose();
          }}
          style={{ fontSize: "20px", fontWeight: fonts.weight.bold }}
        >
          완료
        </button>
      </div>

        {/* 캘린더 본문 */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-[white] rounded-[15px] w-[319px] h-[319px] pt-4 pb-4 px-2 mx-auto">
            {/* 년/월 + border */}
            <div className="flex flex-col items-center">
              <div
                className="flex justify-between items-center text-[17px] w-[270px]"
                style={{ fontWeight: fonts.weight.medium, padding: "5px 0" }}
              >
                <span>
                  {currentYear}년 {currentMonth + 1}월
                </span>
                <div className="flex gap-2 text-[#FB8A1F]">
                  <button onClick={handlePrevMonth}>
                    <IoIosArrowBack size={18} />
                  </button>
                  <button onClick={handleNextMonth}>
                    <IoIosArrowForward size={18} />
                  </button>
                </div>
              </div>
              <div
                className="border-b border-[#D9D9D9]"
                style={{ width: "270px", marginBottom: "6px" }}
              />
            </div>

            {/* 요일 */}
            <div className="grid grid-cols-7 text-center text-[15px] font-medium text-[#A0A0A0] px-1 mb-[3px]">
              {days.map((day, idx) => (
                <div
                  key={day}
                  className={
                    idx === 0
                      ? "text-[#F25C5C]"
                      : idx === 6
                      ? "text-[#999999]"
                      : ""
                  }
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 날짜 */}
            <div
              className="grid grid-cols-7 grid-rows-6 px-1"
              style={{
                height: "232px",
                gap: "3px",
              }}
            >
              {emptyBefore.map((_, i) => (
                <div key={`empty-start-${i}`} />
              ))}

              {dayCells.map((_, i) => {
                const day = i + 1;
                const cellDate = new Date(currentYear, currentMonth, day);
                const isToday =
                  today.toDateString() === cellDate.toDateString();
                const isFuture = cellDate > today;

                const isSelected =
                  selectedDateState.getFullYear() === currentYear &&
                  selectedDateState.getMonth() === currentMonth &&
                  selectedDateState.getDate() === day;

                const baseClass =
                  "w-[30px] h-[30px] flex items-center justify-center rounded-full mx-auto";
                const colorClass = isToday
                  ? "bg-[#4289C1] text-white"
                  : isSelected
                  ? "bg-[#FFD18E] text-black"
                  : "hover:bg-gray-100 text-black";

                return (
                  <button
                    key={day}
                    onClick={() => !isFuture && handleDateSelect(day)}
                    disabled={isFuture}
                    className={`${baseClass} ${colorClass}`}
                    style={{
                      fontWeight: fonts.weight.bold,
                      fontSize: fonts.size.body,
                    }}
                  >
                    {day}
                  </button>
                );
              })}

              {emptyAfter.map((_, i) => (
                <div key={`empty-end-${i}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarModal;
