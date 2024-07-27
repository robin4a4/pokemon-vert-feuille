import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  isValidElement,
  cloneElement,
  Children,
} from "react";
import { Button, Window, WindowContent, WindowHeader } from "react95";
import { MotionProps, motion, useDragControls } from "framer-motion";

const DialogContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({ isOpen: false, setIsOpen: () => {} });

export function DialogRoot({ children }: PropsWithChildren<{}>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DialogContext.Provider>
  );
}
export function DialogTrigger({ children }: PropsWithChildren<{}>) {
  const { setIsOpen } = useContext(DialogContext);
  if (isValidElement(children)) {
    return cloneElement(children, {
      // @ts-ignore
      onClick: () => {
        setIsOpen(true);
      },
    });
  }
  if (Children.count(children) > 1) {
    Children.only(null);
  }
  return null;
}
export function DialogContent({
  children,
  title,
  ...props
}: PropsWithChildren<{ title: string } & MotionProps>) {
  const { isOpen, setIsOpen } = useContext(DialogContext);
  const dragControls = useDragControls();

  function startDrag(event: React.PointerEvent) {
    dragControls.start(event);
  }

  if (!isOpen) return null;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragListener={false}
      dragControls={dragControls}
      className="fixed top-8 right-8"
      style={{ zIndex: 1000 }}
      {...props}
    >
      <Window className="window w-full h-full min-h-[300px]">
        <WindowHeader
          className="window-title flex justify-between items-center"
          onPointerDown={startDrag}
        >
          <span>{title}</span>

          <Button onClick={() => setIsOpen(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M5 5h2v2H5zm4 4H7V7h2zm2 2H9V9h2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2zm2-2v2h-2V9zm2-2v2h-2V7zm0 0V5h2v2z"
              ></path>
            </svg>
          </Button>
        </WindowHeader>
        <WindowContent>{children}</WindowContent>
      </Window>
    </motion.div>
  );
}
