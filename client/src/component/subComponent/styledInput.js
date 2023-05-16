import styled from "styled-components";

export const Input = styled.input.attrs(props => ({
    type: "text",
    size: props.size || "1em",
  }))`
    color: palevioletred;
    font-size: 1em;
    border: 2px solid palevioletred;
    border-radius: 3px;
  
    /* here we use the dynamically computed prop */
    margin: ${props => props.size};
    padding: ${props => props.size};
  `;