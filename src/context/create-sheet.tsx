import { createContext, useContext } from 'react';

type CreateSheetValue = {
  openCreate: () => void;
};

const CreateSheetContext = createContext<CreateSheetValue>({ openCreate: () => undefined });

export function CreateSheetProvider({ children, openCreate }: { children: React.ReactNode; openCreate: () => void }) {
  return <CreateSheetContext.Provider value={{ openCreate }}>{children}</CreateSheetContext.Provider>;
}

export function useCreateSheet() {
  return useContext(CreateSheetContext);
}
