import React from "react";
import { useRecoilValue } from "recoil";
import { useResizeDetector } from "react-resize-detector";
import { peersState } from "../../atoms/peers";
import LocalVideo from "./local-video";
import PeerVideo from "./peer-video";
import classNames from "classnames";

function chunk<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  let i = 0;

  while (i < array.length) {
    chunks.push(array.slice(i, (i += chunkSize)));
  }

  return chunks;
}

export default function Grid() {
  const peers = useRecoilValue(peersState);

  const { width, height, ref } = useResizeDetector();

  const videos = React.useMemo<React.ReactElement[]>(() => {
    return [
      <LocalVideo key="local" />,
      ...peers.map((peer) => <PeerVideo key={peer.sid} peer={peer} />),
    ];
  }, [peers]);

  const isPortrait = (width ?? 0) < (height ?? 0);
  const total = videos.length;
  const x = Math.floor(Math.sqrt(total));
  const y = Math.ceil(total / x);
  const cols = isPortrait ? x : y;
  const rows = isPortrait ? y : x;

  const videosRows = React.useMemo(() => {
    return chunk(videos, isPortrait ? rows : cols);
  }, [cols, isPortrait, videos, rows]);

  const { cellWidth, cellHeight } = React.useMemo(() => {
    const padding = window.innerWidth < 640 ? 4 : 8;

    let cellWidth = (width ?? 0) / cols;
    let cellHeight = (height ?? 0) / rows;

    if (cellWidth / 4 > cellHeight / 3) {
      cellWidth = 4 * (cellHeight / 3);
    }

    if (cellHeight > cellWidth) {
      cellHeight = cellWidth;
    }

    return {
      cellWidth: cellWidth - (padding * rows - padding),
      cellHeight: cellHeight - (padding * rows - padding),
    };
  }, [cols, height, rows, width]);

  const columnClassName = classNames(
    "flex items-center justify-center w-full h-full",
    {
      "flex-col": !isPortrait,
      "flex-row": isPortrait,
    }
  );

  const rowClassName = classNames("flex", {
    "flex-row pb-1 sm:pb-2 last:pb-0 last:sm:pb-0": !isPortrait,
    "flex-col pr-1 sm:pr-2 last:pr-0 last:sm:pb-0": isPortrait,
  });

  const videoClassName = classNames("inline-block", {
    "pr-1 sm:pr-2 last:pr-0 last:sm:pr-0": !isPortrait,
    "pb-1 sm:pb-2 last:pb-0 last:sm:pb-0": isPortrait,
  });

  return (
    <div className="w-full h-full p-1 sm:p-2">
      <div ref={ref} className={columnClassName}>
        {videosRows.map((videosRow, index) => (
          <div key={`row-${index}`} className={rowClassName}>
            {videosRow.map((video, index) => (
              <div
                key={`video-${index}`}
                className={videoClassName}
                style={{ width: cellWidth, height: cellHeight }}
              >
                {video}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
