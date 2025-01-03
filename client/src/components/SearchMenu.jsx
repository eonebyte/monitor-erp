import { Select } from 'antd';
import PropTypes from 'prop-types';

const SearchMenu = ({ onMenuClick }) => {
  const handleChange = (value) => {
    if (onMenuClick) {
      onMenuClick(value); // Menangani klik menu dengan nilai yang dipilih
    }
  };

  return (
    <Select
    showSearch
    style={{
      width: 200,
      marginRight: 5
    }}
    placeholder="Search to Select"
    optionFilterProp="label"
     filterOption={(input, option) =>
        option.children.toLowerCase().includes(input.toLowerCase())
      }
    onChange={handleChange}
    options={[
      {
        value: '1',
        label: 'About',
      },
      {
        value: '2-1',
        label: 'List Contact',
      },
      {
        value: '2-2',
        label: 'Contact Detail',
      },
    ]}
  />
  );
};

SearchMenu.propTypes = {
  onMenuClick: PropTypes.func
};

export default SearchMenu;
