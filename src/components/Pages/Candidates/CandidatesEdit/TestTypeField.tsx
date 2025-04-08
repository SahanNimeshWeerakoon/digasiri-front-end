import {
    Box, Chip,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid2, InputAdornment,
    Radio,
    RadioGroup,
    TextField, Typography,
} from "@mui/material";
import {ITestTypeField} from "@/utils/types.ts";
import {useCallback, useEffect, useState} from "react";
import UploadImage from "@/components/Common/UploadImage.tsx";
// @ts-ignore
import debounce from 'lodash/debounce';
import useMedicalTest from "@/hooks/useMedicalTest.ts";
import {InfoOutlined} from "@mui/icons-material";

export default function TestType({data, appointmentId, onChange}: {
    data: ITestTypeField,
    appointmentId: number | undefined,
    onChange: any
}) {
    const [value, setValue] = useState<string | File | null>("");
    const [is, setIs] = useState<boolean>(false);
    const {editUpdatedResults} = useMedicalTest()

    const criteria = () => {
        let chip = is ? <Chip label="Good" size="small" variant="outlined" sx={{backgroundColor: 'rgba(46, 125, 50, 0.3)'}} color="success"/> :
            <Chip label="Concerning" icon={<InfoOutlined/>} size="small" variant="outlined" sx={{backgroundColor: 'rgba(211, 47, 47, 0.3)'}} color="error"/>;

        if (data?.TestCriteria?.length > 0) {
            return <Box>{value && chip}</Box>
        }
    }

    const textarea = (
        <Grid2 size={6}>
            <Box>
                <TextField
                    label={data?.testTypeFieldName}
                    value={value}
                    onChange={e => setValue(e?.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                />
            </Box>
        </Grid2>
    );

    const radio = (
        <Grid2 size={6}>
            <Box>
                <FormControl sx={{minWidth: '100%'}}>
                    <FormLabel>{data?.testTypeFieldName}</FormLabel>
                    <RadioGroup row value={value || ""} onChange={(e) => setValue(e.target.value)}>
                        {data && data?.radioOptions?.map((option: string, index: number) => {
                            return <FormControlLabel key={index} value={option} control={<Radio/>} label={option}/>
                        })}
                    </RadioGroup>
                </FormControl>
            </Box>
            {criteria()}
        </Grid2>
    );

    const text = (
        <Grid2 size={6}>
            <Box>
                <TextField slotProps={{
                    input: {
                        endAdornment: <InputAdornment position="start">{data?.unit ? data?.unit : ''}</InputAdornment>,
                    },
                }} label={data?.testTypeFieldName} value={value} onChange={e => setValue(e?.target.value)}
                           sx={{minWidth: '100%', marginBottom: 1}} variant="outlined"/>
            </Box>
            {criteria()}
        </Grid2>
    );

    const file = (
        <Grid2 size={12}>
            <Box>
                <Typography variant="body2" color="textSecondary"
                            sx={{marginBottom: 1}}>{data?.testTypeFieldName}</Typography>
                <UploadImage src={data?._value?.file} onUpload={setValue}/>
            </Box>
        </Grid2>
    );

    const onUpdateValue = async (value: any) => {
        const params = {
            appointmentId: appointmentId,
            testTypeFieldId: data?.id,
            result: "",
            file: ""
        };

        if (data?.inputType === "file") {
            params.file = value;
        } else {
            params.result = value;
        }

        onChange(params);
        await editUpdatedResults(params);
    }

    const verify = useCallback(
        debounce((value: any) => {
            onUpdateValue(value);
        }, 1000),
        []
    );

    const formBasedOnRole = () => {
        switch (data.inputType) {
            case "text":
                return text;

            case "textarea":
                return textarea;

            case "radio":
                return radio;

            case "file":
                return file;

            default:
                return null;
        }
    }

    useEffect(() => {
        if (value) verify(value);
        //
        if (!(data?.TestCriteria?.length > 0)) return;
        if (!data?.TestCriteria[0]?.avgHighMargin || !data?.TestCriteria[0]?.avgLowMargin) return;

        let min: any = data.TestCriteria[0]?.avgLowMargin;
        let max: any = data?.TestCriteria[0]?.avgHighMargin;
        let val: any = value;

        if (data?.inputType === 'text') {
            min = Number(min);
            max = Number(max);
            val = Number(val);

            if (Number.isInteger(max) && Number.isInteger(min) && Number.isInteger(val)) {
                setIs(max >= val && val >= min)
            }
        }

        if (data?.inputType === 'radio') {
            if (val === max) {
                setIs(true);
            }
            if (val === min) {
                setIs(false);
            }
        }
    }, [value, setValue]);

    useEffect(() => {
        if (data?.inputType === "file") {
            setValue(data?._value?.file || null);
        } else {
            setValue(data?._value?.result || "");
        }
    }, [data])

    return (
        <>
            {formBasedOnRole()}
        </>
    );
}