import Logo from './assets/logo_green.png';

const SideNav = (playlists, activePlaylist, onclick) => {
  return (
    <div className="side-nav-custom">
      <img src={Logo} id="logo" alt="Spotify logo"></img>
      <div>
        <p id='playlists-title'>YOUR PLAYLISTS</p>
        <div className="divider" />
      </div>
      {renderPlaylists(playlists, activePlaylist, onclick)}
      <div id='side-footer' className='flex-row valign-wrapper'>
        <p>Lucia Gomez</p>
        <a href="http://lucia-gomez.netlify.app"><i className="material-icons">launch</i></a>
      </div>
    </div>
  );
};

function renderPlaylists(playlists, activePlaylist, onclick) {
  return (
    <div className='collection'>
      <div >
        {playlists.map((playlist, i) => {
          const active = activePlaylist === i ? 'active' : '';
          return <div
            className={"collection-item " + active}
            key={i}
            onClick={() => onclick(playlist, i)}
          >
            {playlist.name}
          </div>
        })}
      </div>
    </div>
  )
}

export default SideNav;