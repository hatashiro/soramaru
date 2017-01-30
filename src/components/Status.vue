<template>
  <div class='status'>
    <div class='header'>
      <div class='profile'>
        <div class='datetime'>{{ timeago }}</div>
        <a class='profile-link' href='https://twitter.com/{{ user.screenName }}'>
          <div class='image-wrapper'>
            <img :src='user.profileImage'>
          </div>
          <div class='names'>
            <div class='name'>{{ user.name }}</div>
            <div class='screen-name'>@{{ user.screenName }}</div>
          </div>
        </a>
      </div>
      <div v-if='retweeter' class='retweeter'>
        <i class="fa fa-retweet" aria-hidden="true"></i> retweeted by
        <a class='profile-link' href='https://twitter.com/{{ retweeter.screenName }}'>
          <img :src='retweeter.profileImage'>{{ retweeter.name }}
        </a>
      </div>
    </div>
    <div class='photos'>
      <status-image v-for='photo in photos' :photo='photo'></status-image>
    </div>
    <div class='text'>{{ text }}</div>
    <div class='functions'>
      <a class='function' @click.prevent='like'><i :class='likeClass' aria-hidden="true"></i></a>
      <a class='function' :href='url'><i class="fa fa-external-link" aria-hidden="true"></i></a>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import StatusImage from './StatusImage.vue';

export default {
  props: ['status'],
  components: { StatusImage },
  data() {
    return this.status;
  },
  computed: {
    timeago() {
      return moment(new Date(this.datetime)).fromNow(true);
    },
    likeClass() {
      return ['fa', this.favorited ? 'fa-heart' : 'fa-heart-o'];
    },
  },
  methods: {
    async like() {
      const owner = this.$route.params.owner;
      const slug = this.$route.params.slug;
      const statusId = this.idStr;

      this.favorited = true;
      try {
        await this.$http.post('/twitter/like', { owner, slug, statusId });
      } catch (err) {
        this.favorited = false;
        throw err;
      }
    },
  },
};
</script>

<style scoped>
.status {
  background: #fff;
  margin-bottom: 8px;
  border: 1px solid #e1e8ed;
  border-radius: 5px;

  .header {
    padding: 5px 7px;
    border-bottom: 1px solid #e1e8ed;
    position: relative;

    .profile {
      &.half {
        width: 50%;
      }
      &.retweeter {
        float: right;
      }

      .datetime {
        font-size: 12px;
        color: #999;
        margin: 0 0 3px 2px;
      }

      a.profile-link {
        display: inline-block;
        max-width: 100%;
        color: #444;
        &:visited {
          color: #444;
        }
        text-decoration: none;

        .image-wrapper {
          width: 36px;
          height: 36px;
          border: 1px solid #e1e8ed;
          border-radius: 20px;
          overflow: hidden;
          box-sizing: border-box;
          float: left;

          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }

        .names {
          margin-left: 36px;
          font-size: 12px;
          height: 36px;
          box-sizing: border-box;
          padding: 4px 0 4px 3px;

          >div {
            height: 14px;
            line-height: 14px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow-x: hidden;
          }
          .screen-name {
            color: #666;
          }
        }
      }
    }

    .retweeter {
      font-size: 12px;
      color: #999;
      line-height: 20px;
      margin: 1px 0 0 2px;
      white-space: nowrap;
      overflow-x: hidden;
      text-overflow: ellipsis;

      a.profile-link {
        color: inherit;
        text-decoration: none;
        &:visited {
          color: inherit;
        }
        margin-left: 2px;

        img {
          width: 20px;
          height: 20px;
          border-radius: 10px;
          vertical-align: bottom;
          margin-right: 1px;
        }
      }
    }
  }

  .text {
    padding: 5px 7px;
    font-size: 13px;
    border-bottom: 1px solid #e1e8ed;
  }

  .functions {
    padding: 5px 7px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;

    a.function {
      cursor: pointer;
      font-size: 20px;
      color: #888;
      &:visited {
        color: #888;
      }
      display: block;
      height: 25px;
      line-height: 26px;
      width: 30px;
      text-align: center;
    }

    i.fa-heart {
      color: #ffa2ba;
    }
  }
}
</style>
