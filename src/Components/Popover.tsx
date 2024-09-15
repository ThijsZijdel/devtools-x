import { Popover as MantinePopover } from "@mantine/core";

export const Popover = (props: typeof MantinePopover) => {
  return <MantinePopover position="bottom" withArrow {...props} />;
};
