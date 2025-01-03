import PropTypes from 'prop-types';

export function ContactDetail({ contactNumber }) {
  return (
    <div>
      <h1>Contact Detail</h1>
      <p>This is the detail for contact number {contactNumber}</p>
    </div>
  );
}

ContactDetail.propTypes = {
  contactNumber: PropTypes.number, // Pastikan contactNumber harus berupa angka
};
