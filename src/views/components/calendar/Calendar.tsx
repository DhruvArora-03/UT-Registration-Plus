import type { CalendarTabMessages } from '@shared/messages/CalendarMessages';
import type { Course } from '@shared/types/Course';
import CalendarBottomBar from '@views/components/calendar/CalendarBottomBar';
import CalendarGrid from '@views/components/calendar/CalendarGrid';
import { CalendarSchedules } from '@views/components/calendar/CalendarSchedules';
import CalendarHeader from '@views/components/calendar/CalenderHeader';
import ImportantLinks from '@views/components/calendar/ImportantLinks';
import Divider from '@views/components/common/Divider';
import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';
import { useFlattenedCourseSchedule } from '@views/hooks/useFlattenedCourseSchedule';
import { MessageListener } from 'chrome-extension-toolkit';
import React, { useEffect, useRef, useState } from 'react';

import CalendarFooter from './CalendarFooter';
import TeamLinks from './TeamLinks';

/**
 * Calendar page component
 */
export default function Calendar(): JSX.Element {
    const calendarRef = useRef<HTMLDivElement>(null);
    const { courseCells, activeSchedule } = useFlattenedCourseSchedule();

    const [course, setCourse] = useState<Course | null>((): Course | null => {
        const urlParams = new URLSearchParams(window.location.search);
        const uniqueIdRaw = urlParams.get('uniqueId');
        if (uniqueIdRaw === null) return null;

        const uniqueId = Number(uniqueIdRaw);
        const course = activeSchedule.courses.find(course => course.uniqueId === uniqueId);
        if (course === undefined) return null;

        urlParams.delete('uniqueId');
        const newUrl = `${window.location.pathname}?${urlParams}`.replace(/\?$/, '');
        window.history.replaceState({}, '', newUrl);

        return course;
    });

    const [showPopup, setShowPopup] = useState<boolean>(course !== null);
    const [showSidebar, setShowSidebar] = useState<boolean>(true);

    useEffect(() => {
        const listener = new MessageListener<CalendarTabMessages>({
            async openCoursePopup({ data, sendResponse }) {
                const course = activeSchedule.courses.find(course => course.uniqueId === data.uniqueId);
                if (course === undefined) return;

                setCourse(course);
                setShowPopup(true);

                const currentTab = await chrome.tabs.getCurrent();
                if (currentTab === undefined) return;
                sendResponse(currentTab);
            },
        });

        listener.listen();

        return () => listener.unlisten();
    }, [activeSchedule]);

    useEffect(() => {
        if (course) setShowPopup(true);
    }, [course]);

    return (
        <div className='h-full w-full flex flex-col'>
            <CalendarHeader
                onSidebarToggle={() => {
                    setShowSidebar(!showSidebar);
                }}
            />
            <div className='h-full flex overflow-auto pl-3'>
                {showSidebar && (
                    <div className='h-full flex flex-none flex-col justify-between pb-5 pl-4.5'>
                        <div className='mb-3 h-full w-fit flex flex-col overflow-auto pb-2 pr-4 pt-5'>
                            <CalendarSchedules />
                            <Divider orientation='horizontal' size='100%' className='my-5' />
                            <ImportantLinks />
                            <Divider orientation='horizontal' size='100%' className='my-5' />
                            <TeamLinks />
                        </div>
                        <CalendarFooter />
                    </div>
                )}
                <div className='h-full min-w-4xl flex flex-grow flex-col overflow-y-auto' ref={calendarRef}>
                    <div className='min-h-2xl flex-grow overflow-auto pl-2 pr-4 pt-6'>
                        <CalendarGrid courseCells={courseCells} setCourse={setCourse} />
                    </div>
                    <CalendarBottomBar calendarRef={calendarRef} />
                </div>
            </div>

            <CourseCatalogInjectedPopup
                course={course!} // always defined when showPopup is true
                onClose={() => setShowPopup(false)}
                open={showPopup}
                afterLeave={() => setCourse(null)}
            />
        </div>
    );
}
