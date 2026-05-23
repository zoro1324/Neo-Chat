import * as React from "react";

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        "spline-viewer": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & {
            url?: string;
            class?: string;
          },
          HTMLElement
        >;
      }
    }
  }
}
