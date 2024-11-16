import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

import { theme } from '../styles/styles';

interface DatePickerFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  isOptional?: boolean;
  trashAction?: () => void;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onChange,
  isOptional = false,
  trashAction, // Optional function to clear the date which must be in parent component to facilitate handling variables in one place. If not provided, the clear button will not be displayed.
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (event.type === 'set' && selectedDate) {
        onChange(selectedDate || null);
      }
    } else {
      if (selectedDate) {
        onChange(selectedDate || null);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Label and optional indicator */}
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={[styles.label, isOptional && styles.labelIsOptional]}>
          {label}
        </Text>
        {isOptional && (
          <Text style={styles.optionalInParentheses}>(opcional)</Text>
        )}
      </View>

      {/* Date display and calendar icon */}
      <View style={styles.dateContainer}>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[
            styles.input,
            isOptional && styles.inputIsOptional,
            styles.datePicker,
          ]}
        >
          <Text
            style={[
              styles.dateText,
              { color: value ? 'black' : theme.colors.placeholder },
            ]}
          >
            {value ? value.toDateString() : 'La última fecha de corte de pasto'}
          </Text>
          <View style={styles.calendarIconContainer}>
            <Icon name="calendar-range" size={22} color="#fff" />
          </View>
        </TouchableOpacity>
        {/* Clear button (trash icon) */}
        {trashAction && (
          <TouchableOpacity
            onPress={trashAction}
            style={styles.clearIcon}
            hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}
          >
            <Icon name="delete" size={28} color="gray" />
          </TouchableOpacity>
        )}
      </View>

      {/* DateTimePicker modal */}
      {showDatePicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: theme.colors.input.requiredLabelText,
  },
  labelIsOptional: {
    color: theme.colors.input.optionalLabelText,
    fontWeight: 'normal',
  },
  optionalInParentheses: {
    fontSize: 15,
    color: theme.colors.input.optionalLabelText,
    fontStyle: 'italic',
    marginLeft: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1.2,
    borderColor: theme.colors.input.requiredFieldBorder,
    borderRadius: 10,
    padding: 8,
    flex: 1,
    height: 45,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIsOptional: {
    borderWidth: 1,
    borderColor: theme.colors.input.optionalFieldBorder,
  },
  datePicker: {
    padding: 0,
  },
  dateText: {
    fontSize: 16,
    padding: 8,
    paddingLeft: 10,
  },
  calendarIconContainer: {
    backgroundColor: theme.colors.primary,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 14,
    marginRight: -1,
  },
  clearIcon: {
    marginLeft: 12,
    padding: 6,
  },
});

export default DatePickerField;
