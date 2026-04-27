import { createContext, useContext, useState, ReactNode } from "react";
import { Dialer } from "@/components/guardian/Dialer";

interface DialerCtx {
  open: (n: string) => void;
}

const Ctx = createContext<DialerCtx>({ open: () => {} });

export const useDialer = () => useContext(Ctx);

export const DialerProvider = ({ children }: { children: ReactNode }) => {
  const [number, setNumber] = useState("");
  const [shown, setShown] = useState(false);

  return (
    <Ctx.Provider value={{ open: (n) => { setNumber(n); setShown(true); } }}>
      {children}
      {shown && <Dialer number={number} onChange={setNumber} onClose={() => setShown(false)} />}
    </Ctx.Provider>
  );
};
