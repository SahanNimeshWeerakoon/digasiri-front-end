import {
    Button,
    Stack,
    TextField,
    IconButton,
} from '@mui/material';
import {FilterAlt} from '@mui/icons-material';
import useApproval from '@/hooks/useApproval';
import ApprovalCards from '@/components/Pages/Candidates/CandidatesBase/TabApprovals/ApprovalCards';
import ApprovalTable from '@/components/Pages/Candidates/CandidatesBase/TabApprovals/ApprovalTable';
import {useCallback, useEffect, useState} from "react";
import {debounce} from "lodash";

type QueryParams = {
    keyword: string;
}

export default function PatientsBase() {
    const [result, setResult] = useState<any>([]);
    const [count, setCount] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadParams, setLoadParams] = useState<QueryParams>({
        keyword: "",
    });
    const {getApproval} = useApproval();

    const changeSearchParams = useCallback(debounce((value) => {
        setLoadParams({
            keyword: value
        })
    }, 1000), []);

    const loadData = () => {
        setLoading(true);
        getApproval(loadParams?.keyword).then(res => {
            const {searchResult,counts} = res;
            setResult(searchResult);
            setCount(counts);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            console.log(err);
        })
    }

    const columns = ['Name', 'Profession', 'Country Traveling', 'Appointment Date', 'Expiry/Status', 'Passport Number', 'Visited Date', 'Actions'];

    useEffect(() => {
        loadData();
    }, [loadParams, setLoadParams]);

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            <ApprovalCards loading={loading} counts={count} />

            <Stack sx={{p: 2, justifyContent: 'space-between', alignItems: 'center'}} direction="row">
                <Stack direction="row" sx={{alignItems: 'center', columnGap: 2}}>
                    <TextField label="Search" placeholder="Search with Name & Passport Number" variant="outlined" sx={{minWidth:400}} onChange={(e) => changeSearchParams(e.target.value)} />
                    <IconButton aria-label="delete" size="medium">
                        <FilterAlt fontSize="inherit"/>
                    </IconButton>
                </Stack>
                <Stack direction="row" spacing={1}>
                    {/*<Button variant="contained" color="secondary" size="medium" endIcon={<Error />}>Inform Users</Button>*/}
                    <Button variant="contained" color="secondary" size="medium">Search Via Fingerprint</Button>
                </Stack>
            </Stack>

            <ApprovalTable columns={columns} loading={loading} rows={result} />
        </>
    );
}