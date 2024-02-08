import React from 'react';
import { Course, Status } from 'src/shared/types/Course';
import clsx from 'clsx';
import { StatusIcon } from 'src/shared/util/icons';
import Text from '../Text/Text';
import DragIndicatorIcon from '~icons/material-symbols/drag-indicator';

/**
 * Props for PopupCourseBlock
 */
export interface PopupCourseBlockProps {
    className?: string;
    course: Course;
    primaryColor: string;
    secondaryColor: string;
    whiteText?: boolean;
}

/**
 * The "course block" to be used in the extension popup.
 *
 * @param props PopupCourseBlockProps
 */
export default function PopupCourseBlock({
    className,
    course,
    primaryColor,
    secondaryColor,
    whiteText,
}: PopupCourseBlockProps): JSX.Element {
    return (
        <div
            className={clsx(
                className,
                primaryColor,
                'h-full w-full inline-flex items-center justify-center gap-1 rounded pr-3'
            )}
        >
            <div
                className={clsx(
                    secondaryColor,
                    'cursor-move self-stretch px-0.5 flex items-center rounded rounded-r-0'
                )}
            >
                <DragIndicatorIcon className='h-5 w-5 text-white' />
            </div>
            <Text
                className={clsx('flex-grow p3', {
                    'text-white': whiteText,
                    'text-black': !whiteText,
                })}
                variant='h1-course'
            >
                {`${course.uniqueId} ${course.department} ${course.number} - ${course.instructors.length === 0 ? 'Unknown' : course.instructors.map(v => v.lastName)}`}
            </Text>
            {course.status !== Status.OPEN && (
                <StatusIcon
                    status={course.status}
                    className={`text-white justify-self-end rounded p-1px w-5 h-5 ${secondaryColor}`}
                />
            )}
        </div>
    );
}