import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box, Chip,
    FormControl, FormControlLabel,
    FormLabel,
    Grid2, Radio,
    RadioGroup, TextField,
    Typography
} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";

export default function FinalResults({data, setData}: { data: any, setData: any }) {

    return <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMore/>}
        >
            <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%'}}>
                <Typography component="span" variant="body1">Final Result</Typography>
                <Typography component="span" variant="body1" color="textSecondary">Set post evaluation result
                    here</Typography>
            </Box>
        </AccordionSummary>
        <AccordionDetails>
            <Grid2 container spacing={2}>
                <Grid2 size={6}>
                    <Box>
                        <FormControl sx={{minWidth: '100%'}}>
                            <FormLabel>Select Result</FormLabel>
                            <RadioGroup row
                                        value={data?.status||''}
                                        onChange={(e) => {
                                            setData((prev:any) => ({...prev, status: e?.target?.value}))
                                        }}>
                                <FormControlLabel value="fit" sx={{marginRight:1}} control={<Radio sx={{paddingRight: 0}}
                                                                              icon={<Chip label="Fit" color="success"
                                                                                          variant="outlined"/>}
                                                                              checkedIcon={<Chip label="Fit"
                                                                                                 color="success"
                                                                                                 variant="filled"/>}
                                />} label=""/>
                                <FormControlLabel value="unfit" sx={{marginRight:1}} control={<Radio sx={{paddingRight: 0}}
                                                                                icon={<Chip label="Unfit" color="error"
                                                                                            variant="outlined"/>}
                                                                                checkedIcon={<Chip label="Unfit"
                                                                                                   color="error"
                                                                                                   variant="filled"/>}
                                />} label=""/>
                                <FormControlLabel value="pending" control={<Radio sx={{paddingRight: 0}}
                                                                                  icon={<Chip label="Pending"
                                                                                              color="warning"
                                                                                              variant="outlined"/>}
                                                                                  checkedIcon={<Chip label="Pending"
                                                                                                     color="warning"
                                                                                                     variant="filled"/>}
                                />} label=""/>
                            </RadioGroup>
                        </FormControl>
                    </Box>
                </Grid2>
                <Grid2 size={12}>
                    <Box>
                        <TextField
                            label="Remarks if neccessary"
                            value={data?.remark||''}
                            onChange={e => setData((prev:any) => ({...prev, remark: e?.target.value}))}
                            multiline
                            rows={4}
                            fullWidth></TextField>
                    </Box>
                </Grid2>
            </Grid2>
        </AccordionDetails>
    </Accordion>
}