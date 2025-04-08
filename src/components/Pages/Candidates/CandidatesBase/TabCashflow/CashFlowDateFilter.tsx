import {
  Stack,
  Button,
  Select,
  MenuItem,
  IconButton,
  InputLabel,
  FormControl,
} from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import {FilterAlt} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface Props {
  setDateFilter: Function;  
}

const CashFlowDateFilter = ({ setDateFilter }: Props) => {
  const [rangeBy, setRangeBy] = useState("day");
  const [datePickerViews, setDatePickerViews] = useState<any>(['year', 'month', 'day']);

  const handleRangeByChange = (e: any) => {
    const changedVal = e?.target?.value ?? "day";
    
    setRangeBy(changedVal);

    switch(changedVal) {
      case "day":
        setDatePickerViews(['year', 'month', 'day']);
        break;
      case "month":
        setDatePickerViews(['month', 'year']);
        break;
      case "year":
        setDatePickerViews(['year']);
        break;
      default:
        setDatePickerViews(['year', 'month', 'day']);
        break;
    }
  }

  const handleDateChange = (value: Date | null) => {
    if(rangeBy === "day")
      setDateFilter({ fromDate: moment(value).format('YYYY-MM-DD'), toDate: '' });
    else if (rangeBy === "month")
      setDateFilter({ fromDate: moment(value).startOf('month').format('YYYY-MM-DD'), toDate: moment(value).endOf('month').format('YYYY-MM-DD') });
    else if (rangeBy === "year")
      setDateFilter({ fromDate: moment(value).startOf('year').format('YYYY-MM-DD'), toDate: moment(value).endOf('year').format('YYYY-MM-DD') });
  }

  return (
    <Stack sx={{p: 2, justifyContent: 'space-between', alignItems: 'center'}} direction="row">
        <Stack direction="row" sx={{alignItems: 'center', columnGap: 2}}>
            <FormControl sx={{
                minWidth: '14rem'
            }}>
                <InputLabel>Range By</InputLabel>
                <Select
                    label="Range By"
                    value={rangeBy}
                    onChange={handleRangeByChange}
                >
                    <MenuItem value="day">Date</MenuItem>
                    <MenuItem value="month">Month</MenuItem>
                    <MenuItem value="year">Year</MenuItem>
                </Select>
            </FormControl>
            <DatePicker
                label={'Date'}
                views={datePickerViews}
                onChange={handleDateChange}
            />
            <IconButton aria-label="delete" size="medium">
                <FilterAlt fontSize="inherit"/>
            </IconButton>
        </Stack>
        <Stack direction="row" spacing={1}>
            <Button variant="contained" color="secondary" size="medium">Export Data</Button>
        </Stack>
    </Stack>
  );
}

export default CashFlowDateFilter;