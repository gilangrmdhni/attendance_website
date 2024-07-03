import { useState } from 'react';
import Head from 'next/head';
import Footer from '../components/Footer';
import MobileContainer from '../components/MobileContainer';
import HistoryHeader from '../components/history/HistoryHeader';
import HistoryItem from '../components/history/HistoryItem';
import TimeOffItem from '../components/history/TimeOffItem';

const historyData = [
    {
        type: "Office",
        date: "Rabu, 08 Agustus 2024",
        startTime: "08:50 WIB",
        endTime: "17:11 WIB",
        totalTime: "07 : 43 h",
    },
    {
        type: "Anywhere",
        date: "Rabu, 08 Agustus 2024",
        startTime: "08:50 WIB",
        endTime: "17:11 WIB",
        totalTime: "08 : 27 h",
    },
    {
        type: "Office",
        date: "Rabu, 08 Juli 2024",
        startTime: "08:50 WIB",
        endTime: "17:11 WIB",
        totalTime: "08 : 14 h",
    },
    {
        type: "Anywhere",
        date: "Rabu, 08 Juli 2024",
        startTime: "08:50 WIB",
        endTime: "17:11 WIB",
        totalTime: "08 : 04 h",
    },
];

const timeOffData = [
    {
        type: "Sick",
        reason: "Mengalami demam tinggi",
        date: "11 Agustus 2024",
        duration: "Full Day",
    },
    {
        type: "Vacation",
        reason: "Ngambil jatah cuti tahunan",
        date: "07 Juni 2024, 08 Juni 2024, 24 Juni 2024, 28 Juni 2024",
        duration: "Multiple Days",
    },
    {
        type: "Sick",
        reason: "Mengalami demam tinggi",
        date: "11 Agustus 2024",
        duration: "Full Day",
    },
    {
        type: "Vacation",
        reason: "Ngambil jatah cuti tahunan",
        date: "07 Juni 2024, 08 Juni 2024, 24 Juni 2024, 28 Juni 2024",
        duration: "Multiple Days",
    },
];

const History = () => {
    const [activeTab, setActiveTab] = useState('Attendance');

    return (
        <MobileContainer>
            <Head>
                <title>History</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <HistoryHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="px-4 ">
                {activeTab === 'Attendance' && (
                    <>
                        <div className="text-gray-500 text-sm my-2 text-center">MINGGU ke 02 AGUSTUS 2024</div>
                        {historyData.map((item, index) => (
                            <HistoryItem
                                key={index}
                                type={item.type}
                                date={item.date}
                                startTime={item.startTime}
                                endTime={item.endTime}
                                totalTime={item.totalTime}
                            />
                        ))}
                    </>
                )}
                {activeTab === 'Time Off' && (
                    <>
                        <div className="text-gray-500 text-sm my-2 text-center">AGUSTUS 2024</div>
                        {timeOffData.map((item, index) => (
                            <TimeOffItem
                                key={index}
                                type={item.type}
                                reason={item.reason}
                                date={item.date}
                                duration={item.duration}
                            />
                        ))}
                    </>
                )}
            </main>
            <Footer />
        </MobileContainer>
    );
};

export default History;
