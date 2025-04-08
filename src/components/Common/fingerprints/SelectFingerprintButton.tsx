import { Chip } from "@mui/material";

interface Props {
  id: string;
  isLeft: Function;
  isSearch?: boolean;
  selectedIds: string[];
  isLeftSelected: Function;
  isRightSelected: Function;
  handleButtonClick: Function;
}

const SelectFingerprintButton = ({
  id,
  isLeft,
  isSearch,
  selectedIds,
  isLeftSelected,
  isRightSelected,
  handleButtonClick
}: Props) => {
  const shouldButtonClick = () => {
    // if already selected, deselect
    if(selectedIds.includes(id)) handleButtonClick(id);
    // If from search in all candidates and finger is already selected
    if(isSearch && selectedIds.length) return;
    // If left button already selected
    if( isLeft(id) && isLeftSelected()) return;
    // If right button already selected
    if( !isLeft(id) && isRightSelected() ) return;
    // If finger is not selected from specific hand, select
    handleButtonClick(id);  
  }

  const color: any = () => {
    // is finger is selected
    if(selectedIds.includes(id)) return 'success';
    if(isSearch && selectedIds.length) return 'default'
    // left hand finger is selected and not this one
    if(
      isLeft(id) &&
      isLeftSelected()
    ) return 'default';
    // right hand finger is selected and not this one
    if(
      !isLeft(id) &&
      isRightSelected()
    ) return 'default';
    return 'primary'
  }

  return (
    <Chip
      label={id}
      color={color()}
      onClick={() => shouldButtonClick()}
    />
  );
}

export default SelectFingerprintButton