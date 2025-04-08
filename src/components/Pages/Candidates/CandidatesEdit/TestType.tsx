import {
    Box,
    Grid2,
    Stack,
    Typography
} from "@mui/material";
import {grey} from "@mui/material/colors";
import {ITestType} from "@/utils/types.ts";
import TestTypeField from "@/components/Pages/Candidates/CandidatesEdit/TestTypeField";

export default function TestType({data, appointmentId, onChange}:{data:ITestType,appointmentId:number | undefined, onChange:any }) {
    return (
        <div>
            <Stack spacing={4} sx={{
                marginTop: 2
            }}>
                <Typography variant="subtitle1" sx={{
                    backgroundColor: grey[300],
                    borderBlock: '1px solid',
                    borderColor: grey[500],
                    width: '100%',
                    paddingBlock: 2,
                    paddingInline: 1,
                    marginBlock: 2
                }}>{data?.testName}</Typography>
                <Box>
                    {/*<Typography variant="subtitle2" sx={{marginBottom: 1}}>Visual Acuity</Typography>*/}
                    <Grid2 container spacing={2}>
                        {data?.TestTypeFields?.map(field => {
                            return <TestTypeField key={field?.id} data={field} appointmentId={appointmentId} onChange={onChange} />
                        })}
                    </Grid2>
                </Box>
            </Stack>
        </div>
    );
}