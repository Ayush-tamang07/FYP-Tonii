import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';


const Streak = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // Example of days with workouts completed - replace with your actual data
  const workoutDays = [1, 3, 5, 7, 9, 11, 13, 15, 18];
  // Example of past days without workouts - replace with your actual data
  const missedDays = [2, 4, 6, 8, 10, 12, 14, 16, 17];
  
  // Format month and year as YYYY/MM
  const formatYearMonth = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}/${month}`;
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };
  
  // Navigate to next month
  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };
  
  // Generate calendar days for current month
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of month
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Get total days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Day name headers
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    
    // Create day headers
    const dayHeaders = dayNames.map((day, index) => (
      <View key={`header-${index}`} style={styles.dayCell}>
        <Text style={styles.dayHeaderText}>{day}</Text>
      </View>
    ));
    
    // Create calendar days
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayCell} />
      );
    }
    
    // Get current date to mark today
    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
    const currentDate = today.getDate();
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      // Check if this day has a workout
      const isWorkoutDay = workoutDays.includes(day);
      // Check if this is a missed day (past day with no workout)
      const isMissedDay = missedDays.includes(day);
      // Check if this is today
      const isToday = isCurrentMonth && day === currentDate;
      
      days.push(
        <TouchableOpacity 
          key={`day-${day}`} 
          style={styles.dayCell}
          activeOpacity={0.7}
        >
          <View style={[
            styles.dayCircle,
            isWorkoutDay && styles.workoutDayCircle,
            isToday && styles.todayCircle
          ]}>
            <Text style={[
              styles.dayText,
              isWorkoutDay && styles.workoutDayText,
              isMissedDay && styles.missedDayText,
              isToday && styles.todayText
            ]}>
              {day}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    
    return (
      <View>
        <View style={styles.dayHeaderRow}>
          {dayHeaders}
        </View>
        <View style={styles.calendarGrid}>
          {days}
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
      </View>
      
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={prevMonth} style={styles.monthButton}>
          <Text style={styles.monthArrow}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.monthYearText}>{formatYearMonth(currentMonth)}</Text>
        <TouchableOpacity onPress={nextMonth} style={styles.monthButton}>
          <Text style={styles.monthArrow}>▶</Text>
        </TouchableOpacity>
      </View>
      
      {renderCalendar()}
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const cellSize = width / 7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  monthButton: {
    padding: 12,
  },
  monthArrow: {
    fontSize: 16,
    color: '#000',
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dayCell: {
    width: cellSize,
    height: cellSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayHeaderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutDayCircle: {
    backgroundColor: '#000',
  },
  todayCircle: {
    borderWidth: 1,
    borderColor: '#000',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  workoutDayText: {
    color: '#FFFFFF',
  },
  missedDayText: {
    color: '#AAAAAA',
  },
  todayText: {
    fontWeight: '700',
  },
});

export default Streak;