import {
    Box,
    Chip,
    Stack,
    Paper,
    Button,
    Select,
    MenuItem,
    TextField,
    InputLabel,
    IconButton,
    FormControl,
    TableContainer,
    Avatar,
} from '@mui/material';
import _, {debounce} from 'lodash';
import {useNavigate} from "react-router";
import {format, parseISO} from 'date-fns';
import {DataGrid, GridColDef, GridColumnMenu, GridColumnMenuProps} from '@mui/x-data-grid';
import {useEffect, useState, useCallback} from "react";
import {FilterAlt, Visibility} from '@mui/icons-material';

import toast from 'react-hot-toast';

import useCandidate from '@/hooks/useCandidate.ts'
import {IPatientSearchResult} from '@/utils/types.ts';
import useGlobalStore from '@/store/useGlobalStore.ts';

import ModalFingerprintSearch from '@/components/Common/fingerprints/ModalFingerprintSearch';
import AllCandidatesCards from '@/components/Pages/Candidates/CandidatesBase/TabAllCandidates/AllCandidatesCards';

type QueryParams = {
    page: number;
    keyword: string;
    perPage: number;
    country: string;
}

function CustomColumnMenu(props: GridColumnMenuProps) {
    return (
        <GridColumnMenu
            {...props}
            slots={{
                // Hide `columnMenuColumnsItem`
                columnMenuColumnsItem: null,
            }}
        />
    );
}

export default function TabAllCandidates() {
    const [loadParams, setLoadParams] = useState<QueryParams>({
        page: 1,
        keyword: "",
        perPage: 10,
        country: ""
    });
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const [rows, setRows] = useState<IPatientSearchResult[] | undefined>([]);
    const [fingerPrint, setFingerPrint] = useState<{ modal: boolean, image: null | string }>({
        modal: false,
        image: null
    });

    const navigate = useNavigate();
    const {getCandidates,} = useCandidate();
    const countries = useGlobalStore((state: any) => state.countries);

    const viewCandidate = (id: any) => {
        navigate(`/patients/${id}`);
    }

    const loadData = () => {
        setLoadingData(true);
        getCandidates(loadParams.keyword, loadParams.page, loadParams.perPage, loadParams.country).then((res) => {
            setLoadingData(false);
            const data = res?.searchResult?.map((item: IPatientSearchResult) => {
                return {...item, name: `${item.firstName || ''} ${item.lastName || ''}` };
            });
            setRows(data);
        });
    }

    const generateExpiryStatusPill = (status: string) => {
        let color: any;
        switch (status) {
            case "Ongoing":
                color = "warning";
                break;
            case "Expired":
            case "unfit":
                color = "error";
                break;
            case "fit":
                color = "success";
                break;
            default:
                color = "";
        }

        if (status.toLowerCase().includes("pending")) color = "warning";

        return color;
    }

    const changeSearchParams = useCallback(debounce((type, value) => {
        setLoadParams((params: any) => {
            return {
                ...params,
                [type]: value
            }
        })
    }, 1000), []);

    useEffect(() => {
        loadData();
    }, [loadParams, setLoadParams]);

    useEffect(() => {
        toast.success("success");
        loadData();
    }, []);

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            renderCell: (params) => {
                return (
                    <Box sx={{display: 'flex', alignItems: 'center', columnGap: 1}}>
                        <Avatar alt={params.value} src={params.value.avatar}/>
                        {params.value}
                    </Box>
                )
            }
        },
        {field: 'profession', headerName: 'Profession', flex: 1},
        {
            field: 'travellingTo', headerName: 'Country Traveling', flex: 1,
            valueGetter: (_value: any, row: any) => {
                let country = countries?.find((i: any) => i.id === row.travellingTo);
                if (country) return country?.name;
                else return;
            },
        },
        {
            field: 'appointmentDate',
            headerName: 'Appointment Date',
            flex: 1,
            valueGetter: (_value: any, row: any) => {
                return row?.Appointments[0]?.date ? format(parseISO(row?.Appointments[0]?.date), 'dd/MM/yyyy') : "";
            },
        },
        {
            field: 'expiryStatus',
            headerName: 'Expiry/Status',
            flex: 1,
            renderCell: (params) => {
                const color = generateExpiryStatusPill(params.row?.Appointments?.[0]?.status);
                let label = _.capitalize(params.row?.Appointments?.[0]?.status);
                return <Chip size="small" label={label} color={color}/>;
            }
        },
        {field: 'passportNumber', headerName: 'Passport Number', flex: 1},
        {
            field: 'visitedDate',
            headerName: 'Visited Date',
            flex: 1,
            valueGetter: (_value: any, row: any) => {
                return row?.Appointments[0]?.visitedDate ? format(parseISO(row?.Appointments[0]?.visitedDate), 'dd/MM/yyyy') : "";
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            valueGetter: (_value: any, row: any) => {
                return {id: row.id}
            },
            renderCell: (params) => (
                <IconButton aria-label="delete" size="medium" onClick={() => viewCandidate(params.value.id)}>
                    <Visibility fontSize="inherit"/>
                </IconButton>
            )
        },
    ];

    return (
        <>
            <AllCandidatesCards totalCandidates={rows?.length ?? 0}/>

            <Stack sx={{p: 2, justifyContent: 'space-between', alignItems: 'center'}} direction="row">
                <Stack direction="row" sx={{alignItems: 'center', columnGap: 2}}>
                    <TextField id="outlined-basic" label="Search" variant="outlined"
                               onChange={(e) => changeSearchParams("keyword", e.target.value)}/>
                    <FormControl sx={{
                        minWidth: '14rem'
                    }}>
                        <InputLabel id="demo-simple-select-label">Country Traveling</InputLabel>
                        <Select
                            id="demo-simple-select"
                            label="Country Traveling"
                            labelId="demo-simple-select-label"
                            value={loadParams?.country}
                            onChange={(e) => changeSearchParams("country", e.target.value)}
                        >
                            {
                                countries?.map((item: any) => (
                                    <MenuItem value={item?.id} key={item?.id}>{item?.name}</MenuItem>))
                            }
                        </Select>
                    </FormControl>
                    <FilterAlt fontSize="inherit"/>
                    <IconButton aria-label="delete" size="medium">
                    </IconButton>
                </Stack>
                <Stack direction="row" spacing={1}>
                    {/*<Button variant="contained" color="secondary" size="medium">Export Data</Button>*/}
                    <Button variant="contained" color="secondary" size="medium"
                            onClick={() => setFingerPrint((prev) => ({...prev, modal: true}))}>Search Via
                        Fingerprint</Button>
                </Stack>
            </Stack>

            <TableContainer component={Paper} sx={{borderRadius: '0'}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[10, 15, 25, 50]}
                    disableRowSelectionOnClick
                    loading={loadingData}
                    pagination
                    paginationMode="server"
                    rowCount={-1}
                    onPaginationModelChange={(e) => {
                        setLoadParams((params: any) => {
                            return {
                                ...params,
                                page: e.page + 1,
                                perPage: e.pageSize
                            }
                        })
                    }}
                    initialState={{
                        pagination: {
                            paginationModel: {pageSize: 10, page: 0},
                            rowCount: -1
                        },
                    }}
                    sx={{border: 0}}
                    slots={{ columnMenu: CustomColumnMenu }}
                />
            </TableContainer>

            <ModalFingerprintSearch
                open={fingerPrint.modal}
                add={() => {  }}
                setOpen={(val: boolean) => {
                    setFingerPrint((prev) => ({...prev, modal: val}))
                }}
            />
        </>
    );
}