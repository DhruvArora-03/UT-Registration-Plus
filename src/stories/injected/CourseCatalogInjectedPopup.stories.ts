import type { Meta, StoryObj } from '@storybook/react';
import CourseCatalogInjectedPopup from '@views/components/injected/CourseCatalogInjectedPopup/CourseCatalogInjectedPopup';

import { exampleCourse, exampleSchedule } from './mocked';

const meta = {
    title: 'Components/Injected/CourseCatalogInjectedPopup',
    component: CourseCatalogInjectedPopup,
    args: {
        course: exampleCourse,
        activeSchedule: exampleSchedule,
        onClose: () => {},
    },
    argTypes: {
        course: {
            control: {
                type: 'object',
            },
        },
        activeSchedule: {
            control: {
                type: 'object',
            },
        },
        onClose: {
            control: {
                type: 'function',
            },
        },
    },
} satisfies Meta<typeof CourseCatalogInjectedPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        course: exampleCourse,
        activeSchedule: exampleSchedule,
        onClose: () => {},
    },
};
