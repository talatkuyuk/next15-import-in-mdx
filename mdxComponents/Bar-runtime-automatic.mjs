import * as ReactModule from "react";
import * as runtime from "react/jsx-runtime";

// react server component
const Bar = ({
  React = ReactModule,
  jsx: _jsx = runtime.jsx,
  jsxs: _jsxs = runtime.jsxs,
}) => {
  // for escaping pre-rendering error
  if (!React) {
    ("<Bar /> server component doesn't work due to missing React instance");
  }

  React.useId(); // for testing

  return _jsxs("span", {
    style: { color: "var(--primary)" },
    children: [
      "Imports work, Hello from imported ",
      _jsx("code", { children: "<Bar />" }),
      " server component.",
    ],
  });
};

export default Bar;
