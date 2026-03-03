import styled from 'styled-components'

export const StyledButton = styled.button`
  background-color: #0070f3;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0051cc;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`
