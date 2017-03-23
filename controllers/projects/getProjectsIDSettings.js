module.exports = {
  method: 'get',
  endpoint: '/projects/:projectId/settings',
  authenticated: true,
  roles: ['lead', 'core', 'superAdmin'],
  scopes: ['user:email', 'repo'],
  middleware: [],
  controller: getProjectsIDSettings
}

function getProjectsIDSettings (req, res) {
  console.log(req.user.teams)
  if (!req.user.teams.lead.includes(req.params.projectId) && !req.user.roles.superAdmin && !req.user.roles.core) {
    req.flash('errors', { msg: 'You are not authorized to view this resource.' })
    return res.redirect('/projects')
  }
  var Projects = req.models.Projects
  var Users = req.models.Users
  Projects.findOne({'id': req.params.projectId}, function (err, foundProject) {
    if (err) console.error(err)
    foundProject.repositories = foundProject.repositories || []
    Users.find({}, function (err, allUsers) {
      if (err) console.error(err)
      res.render(res.theme.admin + '/views/projects/settings', {
        view: 'project-settings',
        project: foundProject,
        users: allUsers,
        title: 'IDSettings Projects',
        brigade: res.locals.brigade
      })
    })
  })
}
