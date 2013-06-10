// Generated by CoffeeScript 1.4.0
var AJAX_ACCOUNT, AJAX_RESET_PASSWORD, AJAX_SALT, AJAX_USERS, States, Widget,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

window.admin_users = {};

Widget = window.serious.Widget;

States = new window.serious.States();

AJAX_USERS = '/api/users';

AJAX_SALT = '/api/auth/salt';

AJAX_ACCOUNT = '/api/account';

AJAX_RESET_PASSWORD = '/api/account/reset-password';

admin_users.AdminUsers = (function(_super) {

  __extends(AdminUsers, _super);

  function AdminUsers() {
    this.resetPassword = __bind(this.resetPassword, this);

    this.updateUser = __bind(this.updateUser, this);

    this.removeUser = __bind(this.removeUser, this);

    this.addUser = __bind(this.addUser, this);

    this.__getUserById = __bind(this.__getUserById, this);

    this.resendAction = __bind(this.resendAction, this);

    this.cancelEditAction = __bind(this.cancelEditAction, this);

    this.saveEditAction = __bind(this.saveEditAction, this);

    this.editAction = __bind(this.editAction, this);

    this.removeAction = __bind(this.removeAction, this);

    this.showAddUserForm = __bind(this.showAddUserForm, this);

    this.addUserAction = __bind(this.addUserAction, this);

    this.hideMessages = __bind(this.hideMessages, this);

    this.disableLoading = __bind(this.disableLoading, this);

    this.enableLoading = __bind(this.enableLoading, this);

    this.editUser = __bind(this.editUser, this);

    this.bindUI = __bind(this.bindUI, this);
    this.UIS = {
      usersList: '.users',
      emailField: 'input[name=email]',
      statusField: 'select[name=status]',
      loading: '.loading',
      addButton: 'input[name=addUser]',
      confirmDeleteUser: '.confirm-delete',
      editionTmpl: '.user.edition.template',
      msgError: '.alert-error',
      msgSuccess: '.alert-success'
    };
    this.ACTIONS = ['showAddUserForm', 'addUserAction', 'removeAction', 'editAction', 'saveEditAction', 'cancelEditAction', 'resendAction'];
    this.cache = {
      editedUser: null
    };
  }

  AdminUsers.prototype.bindUI = function(ui) {
    AdminUsers.__super__.bindUI.apply(this, arguments);
    return States.set('addUserForm', false);
  };

  AdminUsers.prototype.editUser = function(id) {
    var current_line, nui;
    this.cancelEditAction();
    this.cache.editedUser = this.__getUserById(id);
    nui = this.cloneTemplate(this.uis.editionTmpl, {
      id: this.cache.editedUser.Id,
      creation: this.cache.editedUser.CreatedAt
    });
    nui.find(".email input").val(this.cache.editedUser.Email);
    nui.find("select[name=status] option[value=" + this.cache.editedUser.Role + "]").attr('selected', 'selected');
    current_line = this.uis.usersList.find(".user[data-id=" + this.cache.editedUser.Id + "]");
    return current_line.addClass('hidden').after(nui);
  };

  AdminUsers.prototype.enableLoading = function() {
    this.uis.loading.removeClass('hidden');
    return this.uis.addButton.prop('disabled', true);
  };

  AdminUsers.prototype.disableLoading = function() {
    this.uis.loading.addClass('hidden');
    return this.uis.addButton.prop('disabled', false);
  };

  AdminUsers.prototype.hideMessages = function() {
    return this.uis.msgError.addClass('hidden');
  };

  AdminUsers.prototype.addUserAction = function(evnt) {
    var email, status;
    this.hideMessages();
    email = this.uis.emailField.val();
    status = this.uis.statusField.val();
    return this.addUser(email, status);
  };

  AdminUsers.prototype.showAddUserForm = function(evnt) {
    this.hideMessages();
    return States.set('addUserForm', true);
  };

  AdminUsers.prototype.removeAction = function(evnt) {
    this.hideMessages();
    return this.removeUser($(evnt.currentTarget).data('id'));
  };

  AdminUsers.prototype.editAction = function(evnt) {
    this.hideMessages();
    return this.editUser($(evnt.currentTarget).data('id'));
  };

  AdminUsers.prototype.saveEditAction = function(evnt) {
    var $row, email, status, user;
    this.hideMessages();
    /* Prepare the new user object and call the update method
    */

    $row = this.uis.usersList.find(".user.edition.actual");
    email = $row.find(".email input").val();
    status = $row.find("select[name=status]").val();
    user = this.cache.editedUser;
    this.cache.editedUser.Role = status;
    this.cache.editedUser.Email = email;
    return this.updateUser(this.cache.editedUser);
  };

  AdminUsers.prototype.cancelEditAction = function(evnt) {
    var $edited_row;
    this.hideMessages();
    /* Cancel the edition mode, reset the orginal row
    */

    if (this.cache.editedUser != null) {
      $edited_row = this.uis.usersList.find(".user.edition.actual");
      $edited_row.prev('.user').removeClass('hidden');
      $edited_row.remove();
      return this.cache.editedUser = null;
    }
  };

  AdminUsers.prototype.resendAction = function(evnt) {
    this.hideMessages();
    return this.resetPassword($(evnt.currentTarget).data('id'));
  };

  AdminUsers.prototype.__getUserById = function(id) {
    var res;
    res = $.ajax("" + AJAX_USERS + "/" + id, {
      async: false
    }).responseText;
    res = eval('(' + res + ')');
    if (res.status === "ok") {
      return res.data;
    }
  };

  AdminUsers.prototype.addUser = function(email, status) {
    var _this = this;
    this.enableLoading();
    return $.ajax(AJAX_USERS, {
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify({
        email: email,
        role: status,
        invitation: true
      }),
      success: function(data) {
        _this.disableLoading();
        if (data.status === "error") {
          return _this.uis.msgError.filter(".error-" + data.message).removeClass('hidden');
        } else {
          return window.location.reload();
        }
      },
      error: function() {
        return window.location.reload();
      }
    });
  };

  AdminUsers.prototype.removeUser = function(id) {
    var user,
      _this = this;
    user = this.__getUserById(id);
    if (confirm("" + user.Email + " " + (this.uis.confirmDeleteUser.text()))) {
      return $.ajax("" + AJAX_USERS + "/" + id, {
        dataType: 'json',
        type: 'DELETE',
        data: JSON.stringify({
          pwd: "pouet"
        }),
        success: function(data) {
          _this.disableLoading();
          if (data.status === "error") {
            return _this.uis.msgError.filter(".error-" + data.message).removeClass('hidden');
          } else {
            return window.location.reload();
          }
        },
        error: function() {
          return window.location.reload();
        }
      });
    }
  };

  AdminUsers.prototype.updateUser = function(user) {
    var _this = this;
    return $.ajax("" + AJAX_USERS + "/" + user.Id, {
      dataType: 'json',
      type: 'PUT',
      data: JSON.stringify({
        role: user.Role,
        email: user.Email
      }),
      success: function(data) {
        _this.disableLoading();
        if (data.data.errors != null) {
          return _this.uis.msgError.filter(".error-" + data.data.errors[0]).removeClass('hidden');
        } else {
          return window.location.reload();
        }
      },
      error: function() {
        return window.location.reload();
      }
    });
  };

  AdminUsers.prototype.resetPassword = function(id) {
    var user,
      _this = this;
    user = this.__getUserById(id);
    return $.ajax('/api/account/reset-password', {
      dataType: "json",
      type: "POST",
      data: JSON.stringify({
        email: user.Email
      }),
      success: function(data) {
        if (data.status === "ok") {
          return _this.uis.msgSuccess.html(data.data).removeClass('hidden');
        } else {
          return _this.uis.msgError.filter(".error-" + data.code).removeClass('hidden');
        }
      }
    });
  };

  return AdminUsers;

})(Widget);

$(window).load(function() {
  return Widget.bindAll();
});
