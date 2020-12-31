import { server_url } from './util';

const Settings = () => {
  return (
    <div className='page valign-wrapper'>
      <a href={server_url + "/logout"} className='btn-large'>Log Out</a>
    </div>
  );
};

export default Settings;