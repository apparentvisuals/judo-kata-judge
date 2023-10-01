<template>
  <div class="carousel w-full">
    <div class="carousel-item w-full" v-for="(group, index) in scores" :id="index">
      <div class="w-full p-2">
        <div class="w-full border">
          <h1 class="text-center text-xl bg-primary text-primary-content">{{
            getGroupName(tournament.mats[mat].groups[index], index) }}</h1>
          <table class="table">
            <thead class="bg-primary text-primary-content">
              <tr>
                <th class="w-8 text-center"></th>
                <th>Tori</th>
                <th>Uke</th>
                <th v-if="props.showSubTotal" class="w-16 text-center">1</th>
                <th v-if="props.showSubTotal" class="w-16 text-center">2</th>
                <th v-if="props.showSubTotal" class="w-16 text-center">3</th>
                <th v-if="props.showSubTotal" class="w-16 text-center">4</th>
                <th v-if="props.showSubTotal" class="w-16 text-center">5</th>
                <th class="w-24 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="match in group">
                <td class="text-center">{{ index + 1 }}</td>
                <td>{{ match.tori }}</td>
                <td>{{ match.uke }}</td>
                <td v-if="props.showSubTotal" class="text-center">{{ match.scores[0] }}</td>
                <td v-if="props.showSubTotal" class="text-center">{{ match.scores[1] }}</td>
                <td v-if="props.showSubTotal" class="text-center">{{ match.scores[2] }}</td>
                <td v-if="props.showSubTotal" class="text-center">{{ match.scores[3] }}</td>
                <td v-if="props.showSubTotal" class="text-center">{{ match.scores[4] }}</td>
                <td class="w-24 text-center">{{ match.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div class="flex justify-center w-full py-2 gap-2">
    <a class="btn btn-xs" v-for="(_group, index) in scores" :href="`#${index}`">{{ index + 1 }}</a>
  </div>
</template>

<script setup>
import { getGroupName } from '@/src/utils';

const props = defineProps(['tournament', 'mat', 'show-sub-total']);
const cookie = useCookie('jkj', { default: () => ({}) });
const scores = useState('scores', () => ({}));

onUnmounted(() => {
  if (events) {
    events.close();
  }
});

let events;
function _subscribe(matNumber) {
  if (events) {
    events.close();
  }
  events = new EventSource(`/api/${matNumber}/summary?token=${cookie.value.tCode}`);
  events.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (!data.error) {
      data.forEach((group) => {
        group.sort((a, b) => {
          const aTotal = a.total || 0;
          const bTotal = b.total || 0;
          return bTotal - aTotal;
        });
      });
      scores.value = data;
    } else {
      events.close();
    }
  };
}

_subscribe(props.mat);

</script>
