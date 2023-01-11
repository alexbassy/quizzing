<script lang="ts" setup>
import { ref } from 'vue'
import { useObservable } from '@vueuse/rxjs'
import randomColor from 'randomcolor'
import AddIcon from '@/components/icons/AddIcon.vue'
import CogIcon from '@/components/icons/CogIcon.vue'
import RubbishIcon from '@/components/icons/RubbishIcon.vue'
import CreateLayout from '@/layouts/CreateLayout.vue'
import { formatRelativeTime } from '@/lib/relative-time'
import { addQuiz, deleteQuiz, getQuizzes$, getPlayers$, addPlayer, getRounds$ } from '@/lib/store/client'
import { PlayerEntry, RoundEntry, type QuizEntry } from '@/lib/store/db'
import { LinkTable, LinkTableColumn } from '@/components/table'
import PlayerAvatar from '@/components/player/PlayerAvatar.vue'
import PlayerAttributesPopover from '@/components/player/PlayerAttributesPopover.vue'
import PlayerAvatarList from '@/components/player/PlayerAvatarList.vue'
import SecondaryButton from '@/components/SecondaryButton.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
import SettingsDialog from '@/components/SettingsDialog.vue'

const quizzes = useObservable<QuizEntry[]>(getQuizzes$())

const players = useObservable<PlayerEntry[]>(getPlayers$())

const rounds = useObservable<RoundEntry[]>(getRounds$())

async function createQuiz() {
  await addQuiz()
}

async function createPlayer() {
  await addPlayer({ name: 'New Player', backgroundColor: randomColor({ luminosity: 'bright' }) })
}

async function remove(id: string) {
  await deleteQuiz(id)
}

const activePlayerAttributesPopover = ref<PlayerEntry['id']>()
const activePlayerPosition = ref<{ x: number; y: number }>()
function openPlayerAttributes(event: Event, playerId: string) {
  activePlayerAttributesPopover.value = playerId
  const { offsetTop, offsetLeft } = event.currentTarget as HTMLElement
  activePlayerPosition.value = { x: offsetLeft, y: offsetTop }
}

function closePlayerAttributes() {
  activePlayerAttributesPopover.value = undefined
  activePlayerPosition.value = undefined
}

const isSettingsDialogShown = ref(false)
</script>

<template>
  <CreateLayout>
    <template #title>
      <h1 class="title">Quizzing 🥷</h1>
    </template>
    <template #action>
      <PrimaryButton bg="#ef476f" inline @click="createQuiz"><AddIcon /> Create quiz</PrimaryButton>
      <SecondaryButton aria-label="Settings" is-icon inline @click="isSettingsDialogShown = true">
        <CogIcon />
      </SecondaryButton>
      <SettingsDialog
        :visible="isSettingsDialogShown"
        @cancel="isSettingsDialogShown = false"
        @close="isSettingsDialogShown = false"
      />
    </template>

    <div class="page">
      <section>
        <h3 class="section-title">Quizzes</h3>
        <p class="help">
          A quiz is a set of questions. To start a round, select a quiz from below and click the play button.
        </p>
        <LinkTable :data="quizzes" class="table" :row-link="({ id }) => `/create/${id}`">
          <LinkTableColumn v-slot="{ name }: QuizEntry" title="Name">{{ name }}</LinkTableColumn>
          <LinkTableColumn v-slot="{ questions }: QuizEntry" title="Questions">
            {{ questions?.length ?? 0 }}
          </LinkTableColumn>
          <LinkTableColumn v-slot="{ createdAt }: QuizEntry" title="Created">
            {{ formatRelativeTime(createdAt!) }}
          </LinkTableColumn>
          <LinkTableColumn v-slot="{ updatedAt }: QuizEntry" title="Updated">
            {{ formatRelativeTime(updatedAt!) }}
          </LinkTableColumn>
          <LinkTableColumn v-slot="{ id, name }: QuizEntry" title="">
            <SecondaryButton
              :aria-label="`Delete ${name}`"
              round
              is-icon
              class="delete-button"
              @click.prevent="remove(id!)"
            >
              <RubbishIcon />
            </SecondaryButton>
          </LinkTableColumn>
          <template #empty>
            <p>No quizzes yet. Create one?</p>
          </template>
        </LinkTable>
      </section>

      <section>
        <h3 class="section-title">Players <button @click="createPlayer">+</button></h3>
        <p class="help">
          Add players to keep score while running the quiz. You can choose who is taking part when starting
          the round.
        </p>
        <div class="players">
          <ul class="player-list">
            <li v-for="player in players" :key="player.id">
              <button class="player-list-button" @click="openPlayerAttributes($event, player.id!)">
                <PlayerAvatar :player="player" />
              </button>
            </li>
          </ul>
          <PlayerAttributesPopover
            :visible="Boolean(activePlayerAttributesPopover && activePlayerPosition)"
            :player-id="activePlayerAttributesPopover"
            :x="activePlayerPosition?.x"
            :y="activePlayerPosition?.y"
            @close="closePlayerAttributes"
          />
        </div>
      </section>

      <section>
        <h3 class="section-title">Rounds</h3>
        <p class="help">
          A round is a set of questions from a quiz. To start a round, select a quiz from above and click the
          play button.
        </p>
        <div class="rounds">
          <LinkTable :data="rounds" class="rounds-table" :row-link="({ id }) => `/play/${id}/scores`">
            <LinkTableColumn v-slot="round: RoundEntry" title="Quiz">
              {{ quizzes?.find(({ id }) => id === round.quizId)?.name ?? round.id }}
            </LinkTableColumn>
            <LinkTableColumn v-slot="round: RoundEntry" title="Date">
              {{ formatRelativeTime(round.createdAt) }}
            </LinkTableColumn>
            <LinkTableColumn v-slot="round: RoundEntry" title="Players">
              <PlayerAvatarList v-if="round.players" :player-ids="round.players" />
            </LinkTableColumn>
            <LinkTableColumn v-slot="round: RoundEntry" title="Completed">
              {{ round.completed ? '✅' : '🚫' }}
            </LinkTableColumn>
          </LinkTable>
        </div>
      </section>
    </div>
  </CreateLayout>
</template>

<style lang="scss" scoped>
.table {
  --column-spans: repeat(4, 2fr) 1fr;
  margin-top: 2rem;
}

.rounds-table {
  --column-spans: repeat(2, 1fr) 2fr 1px;
}

.title {
  display: inline-block;
  margin: 0 auto 0 0;
  font-size: var(--create-header-font-size);
  font-weight: normal;
}

.section-title {
  margin: 0 1.5rem;
  font-size: 1.25rem;
  font-weight: bold;
}

.page {
  display: grid;
  margin: 1rem 2rem 0;
  margin-top: 3rem;
  grid-gap: 2rem;
  grid-template-columns: 2fr 1fr;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.players {
  position: relative;
  padding: 0.5rem;
  background-color: var(--background1);
  border-radius: 10px;
}

.player-list {
  display: flex;
  flex-wrap: wrap;
  padding: 1rem;
  gap: 1.5rem;
}

.help {
  margin: 1rem 1.5rem;
  color: rgba(255 255 255 / 70%);
  font-size: 0.875rem;
  font-weight: normal;
}

.delete-button {
  .item:hover & {
    --background-alpha: 10%;
    --foreground-alpha: 30%;

    &:hover {
      --background-alpha: 20%;
      --foreground-alpha: 50%;
    }

    &:active {
      --background-alpha: 10%;
      --foreground-alpha: 30%;
      transform: scale(0.95);
    }
  }
}

.player-list-button {
  all: unset;
  cursor: pointer;
}
</style>
