import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Button, ButtonProps } from '@ks-design-system/ui';

export default {
  title: 'Example/MonorepoButton',
  component: Button,
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'label ->',
  roll: true,
};
