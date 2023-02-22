<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecruitCompany extends Model
{
    use SoftDeletes;

    protected $table = 'recruit_companies';

    public function getFullLogoAttribute() {

        if(empty($this->logo)) {
            // ここはデフォルトの会社画像をセットしてください
            return '/assets/static/images/no_image.png';
        }

        //return $value;
        return '/storage/recruit/' . $this->id . '/logo/' . $this->logo;

    }

}
