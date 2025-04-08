import {
  Button,
  Stack,
  TextField,
  IconButton, ButtonGroup,
} from '@mui/material';
import {FilterAlt} from '@mui/icons-material';

import useAuth from "@/hooks/useAuth.ts";

interface Props {
  currentData: any;
  setSearchData: Function;
  setCurrentData: Function;
}

const QueueFilter = ({currentData, setCurrentData, setSearchData}: Props) => {
  const {getUser} = useAuth();
  const {userData} = getUser();
  
  const handleChange = (type: string, value: string) => {
    setSearchData((prev: any) => ({
      ...prev,
      [type]: value
    }));
  }

  const handleNext = () => {
    let indexOfCurrent = currentData.list.indexOf(currentData.current);
    
    if(indexOfCurrent < (currentData.list.length-1)) {
      setCurrentData((prev: any) => {
        const dt = {...prev, current: currentData.list[indexOfCurrent+1] };
        localStorage.setItem("queueData", JSON.stringify(dt));
        return dt;
      });
    }
  }

  const handleBack = () => {
    let indexOfCurrent = currentData.list.indexOf(currentData.current);
    
    if(indexOfCurrent > 0) {
      setCurrentData((prev: any) => {
        const dt = {...prev, current: currentData.list[indexOfCurrent-1] };
        localStorage.setItem("queueData", JSON.stringify(dt));
        return dt;
      });
    }
  }

  return (
    <Stack sx={{p: 2, justifyContent: 'space-between', alignItems: 'center'}} direction="row">
        <Stack direction="row" sx={{alignItems: 'center', columnGap: 2}}>
            <TextField id="outlined-basic" label="Search" variant="outlined" onChange={(e: any) => {handleChange("keyword", e.target.value)}}/>
            <TextField id="outlined-basic" label="Doctor" variant="outlined" onChange={(e: any) => {handleChange("doctor", e.target.value)}}/>
            <IconButton aria-label="delete" size="medium">
                <FilterAlt fontSize="inherit"/>
            </IconButton>
        </Stack>
        <Stack direction="row" spacing={1}>
          {userData.userRole === 1 || userData.userRole === 3 || userData.userRole === 5 ? (
            <>
              <ButtonGroup variant="contained" color="secondary">
                <Button size="medium" onClick={handleBack}>
                  BACK
                </Button>
                <Button size="medium" onClick={handleNext}>
                  NEXT
                </Button>
              </ButtonGroup>
            </>
          ) : ""}
            
        </Stack>
    </Stack>
  );
}

export default QueueFilter;