import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Button, ButtonProps } from '@ks-design-system/ui';
import { roll } from '@ks-design-system/utils';

export default {
  title: 'Example/Button',
  component: Button,
  parameters: {
    docs: {
      inlineStories: false,
    },
  },
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Default = Template.bind({});
Default.args = {
  type: 'button',
  text: roll('1d20'),
};
