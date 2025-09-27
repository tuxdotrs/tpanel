import AstalCava from "gi://AstalCava";
import { createState } from "ags";

const blocks = [
  "\u2581",
  "\u2582",
  "\u2583",
  "\u2584",
  "\u2585",
  "\u2586",
  "\u2587",
  "\u2588",
];

const CAVA_BARS = 14;

export const Cava = () => {
  const cava = AstalCava.get_default()!;
  cava.set_bars(CAVA_BARS);

  const [visible, setVisible] = createState(false);
  const [visuals, setVisuals] = createState("");

  cava.connect("notify::values", ({ values }) => {
    const isVisible = shouldVisualize(CAVA_BARS, values);
    if (isVisible) {
      setVisible(true);
      setVisuals(
        values
          .map(
            (val) => blocks[Math.min(Math.floor(val * 8), blocks.length - 1)],
          )
          .join(""),
      );
    } else {
      setVisible(false);
    }
  });

  return (
    <box cssClasses={["pill", "cava"]} visible={visible}>
      <label label={visuals} />
    </box>
  );
};

const shouldVisualize = (bars: number, values: number[]): boolean => {
  return !(bars === 0 || values.length === 0 || values.every((v) => v < 0.001));
};
