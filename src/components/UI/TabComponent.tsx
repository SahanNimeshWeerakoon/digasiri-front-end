import {useState} from 'react';
import {
    Tabs,
    Tab,
    Box,
} from '@mui/material';
import * as React from "react";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

// @ts-expect-error - any type issue
export default function TabComponent(props) {
    const {tabs} = props;
    const [value, setValue] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{width: '100%'}}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={value} onChange={handleChange} aria-label="tabs">
                        {
                            // @ts-expect-error - any type issue
                            tabs.map((tab,index) => (
                                <Tab key={index} {...tab?.tab} />
                            ))
                        }
                    </Tabs>
                </Box>
                {
                    // @ts-expect-error - any type issue
                    tabs.map((tab, index) => (
                        <CustomTabPanel value={value} index={index} key={index}>{tab?.content}</CustomTabPanel>
                    ))
                }
            </Box>
        </>
    );
}