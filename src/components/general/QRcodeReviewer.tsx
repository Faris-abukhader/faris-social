import { useCallback, useRef, useState } from "react";
import { useQRCode } from "next-qrcode";
import useColorSchemaStore from "zustandStore/colorSchemaStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@faris/components/ui/popover";
import { Button } from "@faris/components/ui/button";
import { DownloadIcon, QrCodeIcon } from "lucide-react";
import html2canvas from "html2canvas";
import Loading from "./Loading";

type Target = "profile" | "page" | "group";
export default function QRcodeReviewer({
  target,
  path,
}: {
  target: Target;
  path: string;
}) {
  const color = useColorSchemaStore((state) => state.colorSchema);
  const { SVG } = useQRCode();
  const ref = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const getImage = useCallback(async () => {
    const container = document.getElementById("qrcode_container");
    if (!container) return;
    setIsLoading(true);
    const canvas = await html2canvas(container);
    const image = canvas.toDataURL("image/png", 1.0);
    const link = document.createElement("a");
    link.download = `${new Date().getMilliseconds()}.png`;
    link.href = image;
    link.click();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, path]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button id="qrcode_button" size={"sm"} variant="outline">
          <QrCodeIcon className="h-4 w-4" />
          <span className="sr-only mx-auto">qrcode button</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" w-56 p-2">
        <div id="qrcode_container" ref={ref}>
          <SVG
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            text={`${process.env.BASE_URL!}/${target}/${path}`}
            options={{
              margin: 2,
              width: 200,
              color:
                color == "dark"
                  ? {
                      dark: "#e5e7eb",
                      light: "#20293a",
                    }
                  : {
                      dark: "#000000",
                      light: "#ffffff",
                    },
            }}
          />
        </div>
        <div className="flex w-full justify-center pt-2">
          <Button
            disabled={isLoading}
            onClick={() => void getImage()}
            size={"sm"}
            variant={"outline"}
          >
            {isLoading ? <Loading /> : <DownloadIcon className="h-4 w-4" />}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
