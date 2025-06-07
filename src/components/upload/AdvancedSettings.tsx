import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { ErrorMessage, Form, Formik } from 'formik';
import { CalendarIcon, Clock } from 'lucide-react';
import React from 'react';
import * as Yup from 'yup';

interface AdvancedSettingsProps {
    initialData: any;
    onSubmit: (data: any) => void;
}

interface FormDataType {
    comments: boolean;
    ageRestriction: boolean;
    schedulePublish: boolean;
    publishDate: Date | undefined;
    publishTime: string;
    [key: string]: any;
}

// Define Yup validation schema
const AdvancedSettingsSchema = Yup.object().shape({
    comments: Yup.boolean(),
    ageRestriction: Yup.boolean(),
    schedulePublish: Yup.boolean(),
    publishDate: Yup.date().when('schedulePublish', {
        is: true,
        then: (schema) => schema.required('Please select a date'),
    }),
    publishTime: Yup.string().when('schedulePublish', {
        is: true,
        then: (schema) => schema.required('Please select a time'),
    }),
});

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
    initialData,
    onSubmit,
}) => {
    const initialFormValues: FormDataType = {
        ...initialData,
        comments: initialData.comments !== undefined ? initialData.comments : true,
        ageRestriction: initialData.ageRestriction || false,
        schedulePublish: initialData.schedulePublish || false,
        publishDate: initialData.publishDate || undefined,
        publishTime: initialData.publishTime || '12:00',
    };

    return (
        <Formik
            initialValues={initialFormValues}
            validationSchema={AdvancedSettingsSchema}
            onSubmit={onSubmit}
        >
            {({ values, setFieldValue }) => (
                <Form className="space-y-6 py-4">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Comments and ratings</h3>

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="comments">Comments</Label>
                                <p className="text-sm text-muted-foreground">
                                    Allow viewers to comment on this video
                                </p>
                            </div>
                            <Switch
                                id="comments"
                                checked={values.comments}
                                onCheckedChange={(checked) => setFieldValue('comments', checked)}
                            />
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold mb-4">Audience restrictions</h3>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label htmlFor="ageRestriction">Age restriction</Label>
                                    <p className="text-sm text-muted-foreground">
                                        This video is not suitable for viewers under 18
                                    </p>
                                </div>
                                <Switch
                                    id="ageRestriction"
                                    checked={values.ageRestriction}
                                    onCheckedChange={(checked) => setFieldValue('ageRestriction', checked)}
                                />
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold mb-4">Schedule</h3>

                            <div className="flex items-center justify-between mb-4">
                                <div className="space-y-1">
                                    <Label htmlFor="schedulePublish">Schedule publish</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Set a date and time to make this video public
                                    </p>
                                </div>
                                <Switch
                                    id="schedulePublish"
                                    checked={values.schedulePublish}
                                    onCheckedChange={(checked) => setFieldValue('schedulePublish', checked)}
                                />
                            </div>

                            {values.schedulePublish && (
                                <div className="space-y-4 pl-4 border-l-2 border-muted">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Date</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full justify-start text-left font-normal"
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {values.publishDate ? format(values.publishDate, 'PPP') : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={values.publishDate}
                                                        onSelect={(date) => setFieldValue('publishDate', date)}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <div className="text-xs text-red-500">
                                                <ErrorMessage name="publishDate" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="publishTime">Time</Label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="publishTime"
                                                    name="publishTime"
                                                    type="time"
                                                    value={values.publishTime}
                                                    onChange={(e) => setFieldValue('publishTime', e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                            <div className="text-xs text-red-500">
                                                <ErrorMessage name="publishTime" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit">
                            {values.schedulePublish ? 'Schedule' : 'Publish now'}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};
