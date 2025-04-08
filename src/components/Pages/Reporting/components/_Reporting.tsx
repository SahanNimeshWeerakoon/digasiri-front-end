import {
    Button,
    Stack,
    Typography,
} from '@mui/material';
import TabComponent from '@/components/UI/TabComponent.tsx';
import TabPatients from "@/components/Pages/Reporting/components/TabPatients";

export default function PatientsBase() {
    return (
        <>
            <Stack direction="row" sx={{
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
            }}>
                <Stack>
                    <Typography variant="h5">Reporting</Typography>
                    <Typography variant="body2" color="textSecondary">All info about patients updated 2 mins ago automatically</Typography>
                </Stack>
                <Button variant="contained" size="medium">Export</Button>
            </Stack>

            <TabComponent tabs={[
                {
                    tab: {
                        label: 'Patients',
                    },
                    content: <TabPatients />
                },
                {
                    tab: {
                        label: 'Xrays',
                    },
                    content: <>
                        <h1>Xrays</h1>
                    </>
                },
                {
                    tab: {
                        label: 'Blood tests',
                    },
                    content: <>
                        <h1>Blood tests</h1>
                    </>
                },
            ]} />
        </>
    );
}