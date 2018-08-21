import { SvgIcon } from '@material-ui/core';
import styled from 'styled-components';

export default styled(SvgIcon).attrs({
  viewBox: props => props.viewBox || '0 0 17 17',
  nativeColor: props => props.color || 'inherit',
})`
  && {
    font-size: 1em;
  }
`;
