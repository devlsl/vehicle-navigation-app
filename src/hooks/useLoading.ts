import { useCallback, useEffect, useState } from "react";

type LoadingState<D> =
  | {
      status: "idle" | "loading" | "error";
      data: null;
    }
  | {
      status: "success";
      data: D;
    };

export const useLoading = <D>(
  // export const useLoading = <D, Args extends Array<any>>(
  cb: () => Promise<D>,
  //   cb: (...args: Args) => Promise<D>,
  //   args: Args,
  deps: unknown[] = []
) => {
  const [state, setState] = useState<LoadingState<D>>({
    status: "idle",
    data: null,
  });

  useEffect(() => {
    const call = async () => {
      try {
        setState({ status: "loading", data: null });
        // const data = await cb(...args);
        const data = await cb();
        setState({ status: "success", data });
      } catch {
        setState({ status: "error", data: null });
      }
    };
    call();
  }, [...deps]);

  return state;
};

export const useManualLoading = <D>(
  cb: () => Promise<D>,
  deps: unknown[] = []
) => {
  const [state, setState] = useState<LoadingState<D>>({
    status: "idle",
    data: null,
  });

  const call = useCallback(async () => {
    try {
      setState({ status: "loading", data: null });
      // const data = await cb(...args);
      const data = await cb();
      setState({ status: "success", data });
    } catch {
      setState({ status: "error", data: null });
    }
  }, [...deps]);

  return { ...state, call };
};
