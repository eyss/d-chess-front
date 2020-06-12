import { css } from "lit-element";

export const sharedStyles = css`
  .row {
    display: flex;
    flex-direction: row;
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .container {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    flex: 1;
  }
`;
