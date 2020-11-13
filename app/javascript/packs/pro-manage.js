import Vue from "vue/dist/.esm";
import VueResource from "vue-resource";

Vue.use(VueResource);

document.addEventListener("turbolinks:load", () => {
  Vue.http.headers.common["X-CSRF-Token"] = document.querySelector(
    'meta[name="csrf-token"'
  ).get;
  Attribute("content");

  let element = document.getElementById("team-form");

  if (element != null) {
    let id = element.dataset.id;
    let team = JSON.parse(element.dataset.team);
    let users_attributes = JSON.parse(element.dataset.usersAttributes);
    users_attributes.forEach((user) => {
      user._destroy = null;
    });

    let app = new Vue({
      el: element,
      data: function() {
        return {
          id: id,
          team: team,
          errors: [],
          scrollPosition: null,
        };
      },
      mounted() {
        window.addEventListener("scroll", this.updateScroll);
      },
      methods: {
        updateScroll() {
          this.scrollPosition = window.scrollY;
        },
        addUser: function() {
          this.team.users_attributes.push({
            id: null,
            name: "",
            email: "",
            _destroy: null,
          });
        },
        removeUSer: function(i) {
          let user = this.team.users_attributes[i];

          if (user.id == null) {
            this.team.users_attributes.splice(i, 1);
          } else {
            this.team.users_attributes._destroy = "1";
          }
        },
        undoRemove: function(i) {
          this.team.users_attributes[i]._destroy = null;
        },
        saveTeam: function() {
          if (this.id == null) {
            this.$http.post("/teams", { team: this.team }).then(
              (res) => {
                Turbolinks.visit(`/teams/${res.body.id}`);
              },
              (res) => {
                if (res.status == 422) {
                  let json = JSON.parse(res.bodyText);
                  this.errors = json["user.email"][0];
                }
              }
            );
          } else {
            this.$http
              .put(`/teams/${this.id}`, { team: this.team })
              .then((res) => {
                Turbolinks.visit(`/teams/${res.body.id}`);
              });
          }
        },
        existingTeam: function() {
          return this.team.id != null;
        },
      },
    });
  }
});
