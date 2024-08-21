import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';

interface Contribution {
  date: string;
  level: number;
}

interface ContributionChartProps {
  data: Contribution[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  onCellClick: (date: string) => void;
}

// Color and Border mapping function
const getColorForLevel = (level: number): { backgroundColor: string; borderColor: string } => {
  switch (level) {
    case 0:
      return { backgroundColor: 'rgb(22, 27, 34)', borderColor: 'rgb(22, 27, 34)' };
    case 1:
      return { backgroundColor: 'rgb(15, 68, 42)', borderColor: 'rgb(27, 78, 53)' };
    case 2:
      return { backgroundColor: 'rgb(4, 108, 52)', borderColor: 'rgb(17, 116, 62)' };
    case 3:
      return { backgroundColor: 'rgb(41, 165, 69)', borderColor: 'rgb(52, 170, 78)' };
    case 4:
      return { backgroundColor: 'rgb(60, 210, 89)', borderColor: 'rgb(60, 210, 89)' };
    default:
      return { backgroundColor: 'rgb(22, 27, 34)', borderColor: 'rgb(22, 27, 34)' };
  }
};

const ContributionChart: React.FC<ContributionChartProps> = ({
  data,
  selectedYear,
  onYearChange,
  onCellClick,
}) => {
  const startDate = `${selectedYear}-01-01`;
  const endDate = `${selectedYear}-12-31`;

  const generateDatesArray = (startDate: string, endDate: string): Date[] => {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const dates = generateDatesArray(startDate, endDate);

  const dateMap = dates.map((date) => {
    const dateString = date.toISOString().split('T')[0];
    const contribution = data.find((d) => d.date === dateString) || { date: dateString, level: 0 };

    return {
      date: dateString,
      level: contribution.level,
    };
  });

  let startDayOffset = new Date(startDate).getDay() + 1;
  if (startDayOffset > 6) startDayOffset = 0;

  const numWeeks = Math.ceil((dates.length + startDayOffset) / 7);

  const daysOfWeek = [' ', 'Mon', ' ', 'Wed', ' ', 'Fri', ' '];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const monthStartDates = dates.filter((date) => date.getDate() === 1);

  const handleYearChange = (year: string) => {
    onYearChange(parseInt(year, 10));
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        border: `2px solid`,
        borderRadius: `10px`,
        borderColor: `rgb(48,54,61)`,
        width: 'fit-content',
        padding: '25px 55px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginRight: '12px',
            lineHeight: '23px',
            alignSelf: `flex-end`,
          }}
        >
          {daysOfWeek.map((day, index) => (
            <div key={index} style={{ height: '23px' }}>
              {day}
            </div>
          ))}
        </div>

        <div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${numWeeks}, 20px)`,
              gap: '4px',
              marginBottom: '8px',
            }}
          >
            {monthStartDates.map((date, index) => {
              const month = months[date.getMonth()];
              const gridColumn = Math.floor(
                (dateMap.findIndex((d) => d.date === date.toISOString().split('T')[0]) + startDayOffset) / 7
              ) + 1;

              return (
                <div key={index} style={{ gridColumn: gridColumn }}>
                  {month}
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateRows: 'repeat(7, 20px)',
              gridTemplateColumns: `repeat(${numWeeks}, 20px)`,
              gap: '4px',
            }}
          >
            {dateMap.map((d, index) => {
              const dayOfWeek = new Date(d.date).getDay();
              const gridColumn = (index + startDayOffset) % 7 + 1;
              const weekIndex = Math.floor((index + startDayOffset) / 7);

              const { backgroundColor, borderColor } = getColorForLevel(d.level);

              return (
                <div
                  key={index}
                  title={d.date}
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: backgroundColor,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    gridColumn: weekIndex + 1,
                    gridRow: gridColumn,
                    border: `2px solid ${borderColor}`,
                  }}
                  onClick={() => onCellClick(d.date)}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '20px',
          width: '100%',
        }}
      >

        {/* Year Selector */}
        <div className="mr-auto">
          <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              {/* Add more years as needed */}
            </SelectContent>
          </Select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#aaa', marginRight: '8px' }}>Less</span>
          {[0, 1, 2, 3, 4].map((level, index) => {
            const { backgroundColor, borderColor } = getColorForLevel(level);
            return (
              <div
                key={index}
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: backgroundColor,
                  borderRadius: '4px',
                  border: `2px solid ${borderColor}`,
                  marginRight: '4px',
                }}
              />
            );
          })}
          <span style={{ color: '#aaa', marginLeft: '8px' }}>More</span>
        </div>

      </div>
    </div>
  );
};

export default ContributionChart;
